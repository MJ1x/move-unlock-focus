// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import type { Frame } from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import Svg, { Circle, Line } from "react-native-svg";
import {
  FilesetResolver,
  PoseLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const PUSH_UP_COOLDOWN_MS = 600;
const DOWN_THRESHOLD = 95;
const UP_THRESHOLD = 150;
const HIP_ALIGNMENT_THRESHOLD = 165;

interface JointAngles {
  elbow: number;
  shoulder: number;
  hip: number;
}

interface LandmarkOverlayProps {
  width: number;
  height: number;
  landmarks: NormalizedLandmark[];
}

const Overlay: React.FC<LandmarkOverlayProps> = ({ width, height, landmarks }) => {
  if (!width || !height || !landmarks?.length) return null;

  const points = [11, 13, 15, 12, 14, 16, 23, 25, 24, 26];
  const lines: [number, number][] = [
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16],
    [11, 12],
    [11, 23],
    [12, 24],
    [23, 25],
    [24, 26],
  ];

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {lines.map(([start, end]) => {
        const a = landmarks[start];
        const b = landmarks[end];
        if (!a || !b) return null;
        return (
          <Line
            key={`${start}-${end}`}
            x1={a.x * width}
            y1={a.y * height}
            x2={b.x * width}
            y2={b.y * height}
            stroke="rgba(0, 255, 128, 0.6)"
            strokeWidth={4}
          />
        );
      })}
      {points.map((index) => {
        const landmark = landmarks[index];
        if (!landmark) return null;
        return (
          <Circle
            key={index}
            cx={landmark.x * width}
            cy={landmark.y * height}
            r={6}
            fill="rgba(0, 255, 255, 0.9)"
          />
        );
      })}
    </Svg>
  );
};

const calculateAngle = (
  a?: NormalizedLandmark,
  b?: NormalizedLandmark,
  c?: NormalizedLandmark
) => {
  if (!a || !b || !c) {
    return 180;
  }

  const ab = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const cb = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2 + ab.z ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2 + cb.z ** 2);
  if (magAB === 0 || magCB === 0) {
    return 180;
  }

  const cosTheta = dot / (magAB * magCB);
  const clamped = Math.min(1, Math.max(-1, cosTheta));
  return (Math.acos(clamped) * 180) / Math.PI;
};

const averageAngles = (landmarks: NormalizedLandmark[]): JointAngles => {
  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftHip = landmarks[23];
  const leftWrist = landmarks[15];
  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightHip = landmarks[24];
  const rightWrist = landmarks[16];

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
  const rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, landmarks[25]);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, landmarks[26]);

  return {
    elbow: (leftElbowAngle + rightElbowAngle) / 2,
    shoulder: (leftShoulderAngle + rightShoulderAngle) / 2,
    hip: (leftHipAngle + rightHipAngle) / 2,
  };
};

const PushUpCounter: React.FC = () => {
  const device = useCameraDevice("front");
  const cameraRef = useRef<Camera>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const lastRepTimestamp = useRef(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "down" | "up">("idle");
  const [angles, setAngles] = useState<JointAngles>({ elbow: 180, shoulder: 180, hip: 180 });
  const [feedback, setFeedback] = useState("Align yourself in frame");
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);
  const [surface, setSurface] = useState({ width: 0, height: 0 });
  const repState = useRef<"idle" | "down" | "up">("idle");

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "authorized");
    })();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    let cancelled = false;

    const loadModel = async () => {
      try {
        const filesetResolver =
          Platform.OS === "web"
            ? await FilesetResolver.forVisionTasks(
                await PoseLandmarker.VISION_FILESET_PATH
              )
            : undefined;
        const landmarker = await PoseLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "pose_landmarker_full.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
          }
        );
        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setIsReady(true);
        }
      } catch (error) {
        console.error("Failed to load pose landmarker", error);
        setFeedback("Unable to load pose detector");
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [hasPermission]);

  const updateState = useCallback((landmarks: NormalizedLandmark[]) => {
      setLandmarks(landmarks);
      const jointAngles = averageAngles(landmarks);
      setAngles(jointAngles);

      const now = Date.now();
      const sinceLastRep = now - lastRepTimestamp.current;
      const inPlank = jointAngles.hip > HIP_ALIGNMENT_THRESHOLD;

      if (!inPlank) {
        setFeedback("Keep your hips aligned for better form");
        repState.current = "idle";
        setPhase("idle");
        return;
      }

      if (jointAngles.elbow < DOWN_THRESHOLD) {
        if (repState.current !== "down") {
          repState.current = "down";
          setPhase("down");
          setFeedback("Push back up");
        }
        return;
      }

      if (jointAngles.elbow > UP_THRESHOLD && repState.current === "down") {
        if (sinceLastRep > PUSH_UP_COOLDOWN_MS) {
          lastRepTimestamp.current = now;
          repState.current = "up";
          setPhase("up");
          setFeedback("Nice rep! Go again");
          setRepCount((count) => count + 1);
        }
        return;
      }

      if (jointAngles.elbow >= UP_THRESHOLD) {
        repState.current = "idle";
        setPhase("idle");
        setFeedback("Lower yourself to start a rep");
      }
    },
    []
  );

  const processFrame = useCallback(
    (frame: Frame) => {
      "worklet";
      const landmarker = landmarkerRef.current;
      if (!landmarker) return;

      const now = Date.now();
      const results = landmarker.detectForVideo(frame, now);
      const poses = results?.landmarks?.[0];
      if (!poses) return;

      runOnJS(updateState)(poses);
    },
    [updateState]
  );

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          Camera permission is required for real-time pose detection.
        </Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.feedback}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.feedback}>Looking for camera...</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <Text style={styles.feedback}>Loading pose model...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isReady}
        pixelFormat="yuv"
        frameProcessor={processFrame}
        frameProcessorFps={15}
      />

      <View
        style={styles.overlayContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setSurface({ width, height });
        }}
      >
        <Overlay width={surface.width} height={surface.height} landmarks={landmarks} />
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Push-ups</Text>
          <Text style={styles.counterValue}>{repCount}</Text>
        </View>
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedback}>{feedback}</Text>
          <Text style={styles.phase}>Current phase: {phase.toUpperCase()}</Text>
          <Text style={styles.angles}>
            Elbow: {angles.elbow.toFixed(0)}° | Shoulder: {angles.shoulder.toFixed(0)}° | Hip: {angles.hip.toFixed(0)}°
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 24,
  },
  counterContainer: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 16,
    padding: 16,
    alignSelf: "flex-start",
  },
  counterLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  counterValue: {
    color: "#4ade80",
    fontSize: 48,
    fontWeight: "700",
  },
  feedbackContainer: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 16,
    padding: 16,
  },
  feedback: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  phase: {
    color: "#a855f7",
    fontSize: 16,
    marginBottom: 4,
  },
  angles: {
    color: "#cbd5f5",
    fontSize: 14,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 24,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default PushUpCounter;
