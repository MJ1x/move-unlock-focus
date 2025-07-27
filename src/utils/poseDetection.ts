import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface PoseResults {
  landmarks?: any[];
}

// MediaPipe pose landmarks indices
const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28
};

export class ExerciseDetector {
  private pose: Pose;
  private camera: Camera | null = null;
  private onResults: (results: PoseResults) => void;
  
  // Rep counting state
  private repCount = 0;
  private isInDownPosition = false;
  private exerciseType: 'pushups' | 'squats' | 'jumping' = 'pushups';

  constructor(
    videoElement: HTMLVideoElement,
    onResults: (results: PoseResults) => void,
    exerciseType: 'pushups' | 'squats' | 'jumping' = 'pushups'
  ) {
    this.onResults = onResults;
    this.exerciseType = exerciseType;
    
    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults((results: Results) => {
      const poseResults: PoseResults = {
        landmarks: results.poseLandmarks
      };
      this.processResults(poseResults);
      this.onResults(poseResults);
    });

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.pose.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });
  }

  private processResults(results: PoseResults) {
    if (!results.landmarks) return;

    const landmarks = results.landmarks;
    
    switch (this.exerciseType) {
      case 'pushups':
        this.detectPushups(landmarks);
        break;
      case 'squats':
        this.detectSquats(landmarks);
        break;
      case 'jumping':
        this.detectJumpingJacks(landmarks);
        break;
    }
  }

  private detectPushups(landmarks: any[]) {
    // Get shoulder, elbow, and wrist positions
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow) return;

    // Calculate arm angles
    const leftArmAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgArmAngle = (leftArmAngle + rightArmAngle) / 2;

    // Detect down position (arms bent)
    if (avgArmAngle < 90 && !this.isInDownPosition) {
      this.isInDownPosition = true;
    }
    
    // Detect up position (arms extended) - complete rep
    if (avgArmAngle > 160 && this.isInDownPosition) {
      this.isInDownPosition = false;
      this.repCount++;
      this.onRepDetected();
    }
  }

  private detectSquats(landmarks: any[]) {
    // Get hip, knee, and ankle positions
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee) return;

    // Calculate knee angles
    const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Detect down position (knees bent)
    if (avgKneeAngle < 90 && !this.isInDownPosition) {
      this.isInDownPosition = true;
    }
    
    // Detect up position (legs extended) - complete rep
    if (avgKneeAngle > 160 && this.isInDownPosition) {
      this.isInDownPosition = false;
      this.repCount++;
      this.onRepDetected();
    }
  }

  private detectJumpingJacks(landmarks: any[]) {
    // Get arm and leg positions
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) return;

    // Calculate if arms are up (wrists above shoulders)
    const armsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    
    // Calculate leg spread (distance between ankles)
    const legSpread = leftAnkle && rightAnkle ? 
      Math.abs(leftAnkle.x - rightAnkle.x) : 0;

    // Detect jump position (arms up, legs spread)
    if (armsUp && legSpread > 0.2 && !this.isInDownPosition) {
      this.isInDownPosition = true;
    }
    
    // Detect down position (arms down, legs together) - complete rep
    if (!armsUp && legSpread < 0.1 && this.isInDownPosition) {
      this.isInDownPosition = false;
      this.repCount++;
      this.onRepDetected();
    }
  }

  private calculateAngle(a: any, b: any, c: any): number {
    if (!a || !b || !c) return 0;
    
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    
    return angle;
  }

  private onRepDetected() {
    // This will be overridden by the component
    console.log(`Rep detected! Count: ${this.repCount}`);
  }

  public setOnRepDetected(callback: () => void) {
    this.onRepDetected = callback;
  }

  public start() {
    this.camera?.start();
  }

  public stop() {
    this.camera?.stop();
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public resetCount() {
    this.repCount = 0;
    this.isInDownPosition = false;
  }
}