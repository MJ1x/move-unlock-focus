import { useEffect, useRef, type MutableRefObject } from "react";

export type PushUpStage = "ready" | "lowering" | "press";

interface PushUpTrainerProps {
  isActive: boolean;
  onRepDetected: () => void;
  onStatusUpdate?: (message: string) => void;
  onConfidenceUpdate?: (confidence: number) => void;
  onStageChange?: (stage: PushUpStage) => void;
}

interface PoseKeypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

interface Pose {
  keypoints: PoseKeypoint[];
}

interface PoseDetector {
  estimatePoses: (
    video: HTMLVideoElement,
    config?: Record<string, unknown>
  ) => Promise<Pose[]>;
  dispose: () => void;
}

interface PoseDetectionModule {
  SupportedModels: { MoveNet: unknown };
  movenet: { modelType: { SINGLEPOSE_LIGHTNING: unknown } };
  createDetector: (model: unknown, config: Record<string, unknown>) => Promise<PoseDetector>;
  util: {
    getAdjacentPairs: (model: unknown) => Array<[number, number]>;
  };
}

interface TfModule {
  getBackend: () => string;
  setBackend: (backend: string) => Promise<void>;
  ready: () => Promise<void>;
}

const MIN_KEYPOINT_SCORE = 0.4;
const DOWN_ANGLE_THRESHOLD = 120;
const UP_ANGLE_THRESHOLD = 155;
const MIN_REP_INTERVAL_MS = 600;

const TFJS_SRC = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.18.0/dist/tf.min.js";
const POSE_DETECTION_SRC = "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@1.0.4/dist/pose-detection.min.js";

const scriptCache: Record<string, Promise<void>> = {};

const loadScript = (src: string) => {
  if (!scriptCache[src]) {
    scriptCache[src] = new Promise<void>((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Scripts can only be loaded in the browser."));
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener(
          "load",
          () => {
            existing.dataset.loaded = "true";
            resolve();
          },
          { once: true }
        );
        existing.addEventListener(
          "error",
          () => reject(new Error(`Failed to load ${src}`)),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true }
      );
      document.body.appendChild(script);
    });
  }

  return scriptCache[src];
};

const loadPoseDetection = async (
  poseDetectionModuleRef: MutableRefObject<PoseDetectionModule | null>,
  tfModuleRef: MutableRefObject<TfModule | null>
) => {
  if (poseDetectionModuleRef.current && tfModuleRef.current) {
    return;
  }

  await loadScript(TFJS_SRC);
  await loadScript(POSE_DETECTION_SRC);

  const tfGlobal = (window as unknown as Record<string, unknown>).tf as TfModule | undefined;
  const poseDetectionGlobal = (window as unknown as Record<string, unknown>).poseDetection as
    | PoseDetectionModule
    | undefined;

  if (!tfGlobal || !poseDetectionGlobal) {
    throw new Error("Pose detection libraries failed to load.");
  }

  tfModuleRef.current = tfGlobal;
  poseDetectionModuleRef.current = poseDetectionGlobal;
};

const PushUpTrainer = ({
  isActive,
  onRepDetected,
  onStatusUpdate,
  onConfidenceUpdate,
  onStageChange,
}: PushUpTrainerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const poseDetectionModuleRef = useRef<PoseDetectionModule | null>(null);
  const tfModuleRef = useRef<TfModule | null>(null);
  const animationRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const positionRef = useRef<"top" | "bottom">("top");
  const stageRef = useRef<PushUpStage>("ready");
  const lastRepTimeRef = useRef<number>(0);
  const lastStatusRef = useRef<string | null>(null);

  const updateStatus = (message: string) => {
    if (lastStatusRef.current === message) return;
    lastStatusRef.current = message;
    onStatusUpdate?.(message);
  };

  const stopDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    positionRef.current = "top";
    stageRef.current = "ready";
    lastRepTimeRef.current = 0;
    onConfidenceUpdate?.(0);
    lastStatusRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopDetection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isActive) {
      stopDetection();
      onStageChange?.("ready");
      lastStatusRef.current = null;
      return;
    }

    let cancelled = false;

    const initialiseDetector = async () => {
      try {
        await loadPoseDetection(poseDetectionModuleRef, tfModuleRef);
      } catch (error) {
        console.error(error);
        updateStatus("Unable to load the AI pose model. Check your connection and try again.");
        return;
      }

      const poseDetection = poseDetectionModuleRef.current;
      const tf = tfModuleRef.current;

      if (!poseDetection || !tf) {
        updateStatus("Pose detection libraries are unavailable.");
        return;
      }

      try {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          updateStatus("Camera access is not supported in this browser.");
          return;
        }

        updateStatus("Setting up AI pose detection...");

        if (tf.getBackend() !== "webgl") {
          await tf.setBackend("webgl");
        }
        await tf.ready();

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        }

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoElement = videoRef.current;
        if (!videoElement) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        videoElement.srcObject = stream;
        videoElement.playsInline = true;
        videoElement.muted = true;
        streamRef.current = stream;

        await new Promise<void>((resolve) => {
          if (videoElement.readyState >= 1) {
            resolve();
          } else {
            videoElement.onloadedmetadata = () => resolve();
          }
        });

        await videoElement.play();
        videoElement.onloadedmetadata = null;

        const canvasElement = canvasRef.current;
        if (canvasElement) {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
        }

        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        });

        if (cancelled) {
          detector.dispose();
          return;
        }

        detectorRef.current = detector;
        updateStatus("AI ready! Lower your chest with control and press back up.");
        onStageChange?.("ready");
        positionRef.current = "top";
        stageRef.current = "ready";
        lastRepTimeRef.current = 0;

        const detectPoses = async () => {
          if (!detectorRef.current || !videoRef.current || cancelled) {
            return;
          }

          const poses = await detectorRef.current.estimatePoses(videoRef.current, {
            flipHorizontal: false,
          });

          if (!poses.length) {
            drawPose(null);
            onConfidenceUpdate?.(0);
            updateStatus("Step back so I can see your whole body.");
            updateStage("ready");
          } else {
            const pose = poses[0];
            drawPose(pose);
            analysePose(pose);
          }

          animationRef.current = requestAnimationFrame(detectPoses);
        };

        detectPoses();
      } catch (error) {
        console.error(error);
        updateStatus("Unable to start the AI camera. Check camera permissions and try again.");
        stopDetection();
      }
    };

    initialiseDetector();

    return () => {
      cancelled = true;
      stopDetection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const drawPose = (pose: Pose | null) => {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    const poseDetection = poseDetectionModuleRef.current;

    if (!canvas || !videoElement || !poseDetection) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!pose) {
      return;
    }

    const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(34,197,94,0.85)";
    ctx.fillStyle = "rgba(14,116,144,0.9)";

    adjacentPairs.forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];
      if (!kp1 || !kp2) return;
      if ((kp1.score ?? 0) < MIN_KEYPOINT_SCORE || (kp2.score ?? 0) < MIN_KEYPOINT_SCORE) return;
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    });

    pose.keypoints.forEach((keypoint) => {
      if ((keypoint.score ?? 0) < MIN_KEYPOINT_SCORE) return;
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const analysePose = (pose: Pose) => {
    const getPoint = (name: string) => pose.keypoints.find((kp) => kp.name === name);

    const leftShoulder = getPoint("left_shoulder");
    const rightShoulder = getPoint("right_shoulder");
    const leftElbow = getPoint("left_elbow");
    const rightElbow = getPoint("right_elbow");
    const leftWrist = getPoint("left_wrist");
    const rightWrist = getPoint("right_wrist");
    const leftHip = getPoint("left_hip");
    const rightHip = getPoint("right_hip");

    const primaryKeypoints = [
      leftShoulder,
      rightShoulder,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist,
    ].filter(Boolean) as PoseKeypoint[];

    if (
      primaryKeypoints.length < 6 ||
      primaryKeypoints.some((kp) => (kp.score ?? 0) < MIN_KEYPOINT_SCORE)
    ) {
      updateStatus("Make sure your upper body and arms stay inside the frame.");
      onConfidenceUpdate?.(0);
      updateStage("ready");
      positionRef.current = "top";
      return;
    }

    const confidence =
      primaryKeypoints.reduce((sum, kp) => sum + (kp.score ?? 0), 0) / primaryKeypoints.length;
    onConfidenceUpdate?.(confidence);

    const leftAngle = calculateAngle(leftShoulder!, leftElbow!, leftWrist!);
    const rightAngle = calculateAngle(rightShoulder!, rightElbow!, rightWrist!);
    const avgAngle = (leftAngle + rightAngle) / 2;

    if (leftHip && rightHip && (leftHip.score ?? 0) > 0.3 && (rightHip.score ?? 0) > 0.3) {
      const hipHeight = (leftHip.y + rightHip.y) / 2;
      const shoulderHeight = (leftShoulder!.y + rightShoulder!.y) / 2;
      const torsoOffset = Math.abs(shoulderHeight - hipHeight);

      if (torsoOffset > 160) {
        updateStatus("Lower the camera or angle yourself sideways so your torso is visible.");
      }
    }

    const now = performance.now();

    if (avgAngle <= DOWN_ANGLE_THRESHOLD) {
      positionRef.current = "bottom";
      updateStage("lowering");
      updateStatus("Hold the bottom position, keep your core tight.");
    } else if (avgAngle >= UP_ANGLE_THRESHOLD) {
      if (positionRef.current === "bottom" && now - lastRepTimeRef.current > MIN_REP_INTERVAL_MS) {
        positionRef.current = "top";
        lastRepTimeRef.current = now;
        updateStage("press");
        updateStatus("Rep complete! Drive back down for the next one.");
        onRepDetected();
      } else {
        positionRef.current = "top";
        updateStage("press");
        updateStatus("Lock your elbows at the top and squeeze your glutes.");
      }
    } else {
      updateStage("ready");
      updateStatus("Lower with control until your elbows reach 90°.");
    }
  };

  const updateStage = (stage: PushUpStage) => {
    if (stageRef.current === stage) return;
    stageRef.current = stage;
    onStageChange?.(stage);
  };

  const calculateAngle = (a: PoseKeypoint, b: PoseKeypoint, c: PoseKeypoint) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180) / Math.PI);
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  };

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
};

export default PushUpTrainer;
