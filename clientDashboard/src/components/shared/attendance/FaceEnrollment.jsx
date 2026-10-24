import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import toast from "react-hot-toast";

const MODEL_URL = "/models";
const MODEL_VERSION = "face-api-128-v1";

// Tune these thresholds for your camera and lighting.
const EYE_CLOSED_THRESHOLD = 0.27;
const EYE_OPEN_THRESHOLD = 0.28;
const BLINK_CHECK_INTERVAL = 100;

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Each eye has 6 landmarks.
// EAR = (vertical distance 1 + vertical distance 2)
//       / (2 * horizontal distance)
const getEyeAspectRatio = (eye) => {
  const vertical1 = distance(eye[1], eye[5]);
  const vertical2 = distance(eye[2], eye[4]);
  const horizontal = distance(eye[0], eye[3]);

  if (!horizontal) return 0;

  return (vertical1 + vertical2) / (2 * horizontal);
};


const drawFaceLandmarks = (video, canvas, landmarks, leftEAR, rightEAR) => {
  if (!video || !canvas || !landmarks) return;

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) return;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // Draw every detected facial landmark in green.
  const allPoints = landmarks.positions;

  ctx.fillStyle = "#00ff00";

  allPoints.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw the eye outlines.
  const drawEye = (eye, ear) => {
    if (!eye || eye.length < 6) return;

    ctx.beginPath();
    ctx.moveTo(eye[0].x, eye[0].y);

    for (let i = 1; i < eye.length; i++) {
      ctx.lineTo(eye[i].x, eye[i].y);
    }

    ctx.closePath();

    const closed =
      ear < EYE_CLOSED_THRESHOLD;

    ctx.strokeStyle = closed ? "#ff2222" : "#00ff66";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mark each eye landmark with a larger visible dot.
    eye.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = closed ? "#ff2222" : "#00ff66";
      ctx.fill();
    });
  };

  drawEye(landmarks.getLeftEye(), leftEAR);
  drawEye(landmarks.getRightEye(), rightEAR);
};

const FaceEnrollment = ({ onEnrollmentReady }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const blinkClosedRef = useRef(false);
  const blinkVerifiedRef = useRef(false);
  const closedFramesRef = useRef(0);
  const lastEARRef = useRef(0);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [blinkStatus, setBlinkStatus] = useState("Start the camera to begin.");

  // Load face detection, landmarks and descriptor models.
  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        if (mounted) setModelsLoaded(true);
      } catch (err) {
        console.error("Face model loading failed:", err);

        if (mounted) {
          setError(
            "Could not load face models. Check the files in public/models.",
          );
        }
      }
    };

    loadModels();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  // Continuously check for a closed-eye -> open-eye transition.

useEffect(() => {
  if (!modelsLoaded || !cameraReady) return;

  let active = true;
  let checking = false;

  const checkBlink = async () => {
    const video = videoRef.current;

    if (
      !active ||
      checking ||
      !video ||
      video.readyState < 2 ||
      blinkVerifiedRef.current
    ) {
      return;
    }

    checking = true;

    try {
      const result = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4,
          })
        )
        .withFaceLandmarks();

      if (!active) return;

      if (!result) {
        closedFramesRef.current = 0;
        blinkClosedRef.current = false;
        setBlinkStatus("Face not detected. Face the camera.");
        return;
      }

      const leftEye = result.landmarks.getLeftEye();
      const rightEye = result.landmarks.getRightEye();
const leftEAR = getEyeAspectRatio(leftEye);
const rightEAR = getEyeAspectRatio(rightEye);
const averageEAR = (leftEAR + rightEAR) / 2;

drawFaceLandmarks(
  video,
  canvasRef.current,
  result.landmarks,
  leftEAR,
  rightEAR
);
const bothEyesClosed =
  leftEAR < EYE_CLOSED_THRESHOLD &&
  rightEAR < EYE_CLOSED_THRESHOLD;

const bothEyesOpen =
  leftEAR > EYE_OPEN_THRESHOLD &&
  rightEAR > EYE_OPEN_THRESHOLD;

const debugText =
  `EAR: ${((leftEAR + rightEAR) / 2).toFixed(3)} | ` +
  `Left: ${leftEAR.toFixed(3)} | ` +
  `Right: ${rightEAR.toFixed(3)}`;

if (bothEyesClosed) {
  blinkClosedRef.current = true;
  setBlinkStatus(`Eyes closed detected. Open your eyes. ${debugText}`);
} else if (bothEyesOpen && blinkClosedRef.current) {
  blinkClosedRef.current = false;
  blinkVerifiedRef.current = true;

  setBlinkDetected(true);
  setBlinkStatus(`Blink verified! ${debugText}`);
  toast.success("Blink detected. Face capture is enabled.");
} else {
  setBlinkStatus(`Please blink naturally. ${debugText}`);
}
      const ear = (leftEAR + rightEAR) / 2;

      lastEARRef.current = ear;

      // Display live values to help tune thresholds.

      if (
        leftEAR < EYE_CLOSED_THRESHOLD &&
        rightEAR < EYE_CLOSED_THRESHOLD
      ) {
        closedFramesRef.current += 1;
        blinkClosedRef.current = true;

        setBlinkStatus(
          `Eyes closed detected. Open your eyes. (${debugText})`
        );
      } else if (
        blinkClosedRef.current &&
        ear > EYE_OPEN_THRESHOLD
      ) {
        // Eyes have reopened after being closed.
        blinkClosedRef.current = false;
        closedFramesRef.current = 0;
        blinkVerifiedRef.current = true;

        setBlinkDetected(true);
        setBlinkStatus(`Blink verified! ${debugText}`);

        toast.success("Blink detected. Face capture is enabled.");
      } else {
        setBlinkStatus(
          `Please blink naturally. ${debugText}`
        );
      }
    } catch (err) {
      console.error("Blink detection error:", err);
      if (active) {
        setBlinkStatus("Detection error. Check the console.");
      }
    } finally {
      checking = false;
    }
  };

  const timer = setInterval(checkBlink, BLINK_CHECK_INTERVAL);

  return () => {
    active = false;
    clearInterval(timer);
  };
}, [modelsLoaded, cameraReady]);

  const startCamera = async () => {
    closedFramesRef.current = 0;
    lastEARRef.current = 0;
    setError("");
    setPreview("");
    setBlinkDetected(false);
    blinkClosedRef.current = false;
    blinkVerifiedRef.current = false;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access requires HTTPS or localhost.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }

      video.srcObject = stream;
      await video.play();

      setBlinkStatus("Look at the camera and blink naturally.");
      setCameraReady(true);
    } catch (err) {
      console.error("Camera error:", err);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setError(
        err.message?.includes("HTTPS")
          ? err.message
          : "Camera unavailable. Allow camera permission and try again.",
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
    setBlinkDetected(false);
    blinkClosedRef.current = false;
    blinkVerifiedRef.current = false;
    setBlinkStatus("Camera stopped.");
  };

  const captureFace = async () => {
    const video = videoRef.current;

    if (!modelsLoaded || !cameraReady || !video || video.readyState < 2) {
      toast.error("Wait until the camera and face models are ready.");
      return;
    }

    // Enforce blink verification even if this function is called directly.
    if (!blinkVerifiedRef.current) {
      toast.error("Please blink naturally before capturing your face.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await faceapi
        .detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.6,
          }),
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (results.length !== 1) {
        throw new Error(
          results.length === 0
            ? "No face detected. Look directly at the camera."
            : "Multiple faces detected. Make sure only one person is visible.",
        );
      }

      const result = results[0];
      const { width, height } = result.detection.box;

      if (width < 100 || height < 100) {
        throw new Error(
          "Your face is too far away. Move closer to the camera.",
        );
      }

      const descriptor = Array.from(result.descriptor);

      if (descriptor.length !== 128 || !descriptor.every(Number.isFinite)) {
        throw new Error("Invalid face descriptor generated.");
      }

      const box = result.detection.box;

      const left = Math.max(0, box.x);
      const top = Math.max(0, box.y);
      const cropWidth = Math.min(box.width, video.videoWidth - left);
      const cropHeight = Math.min(box.height, video.videoHeight - top);

      if (cropWidth <= 0 || cropHeight <= 0) {
        throw new Error("Invalid face crop. Please try again.");
      }

      const crop = document.createElement("canvas");
      crop.width = Math.max(1, Math.round(cropWidth));
      crop.height = Math.max(1, Math.round(cropHeight));

      const context = crop.getContext("2d");

      if (!context) {
        throw new Error("Could not create the face preview.");
      }

      context.drawImage(
        video,
        left,
        top,
        cropWidth,
        cropHeight,
        0,
        0,
        crop.width,
        crop.height,
      );

      setPreview(crop.toDataURL("image/jpeg", 0.85));

      onEnrollmentReady?.({
        descriptor,
        descriptorDimensions: descriptor.length,
        modelVersion: MODEL_VERSION,
        quality: {
          detectionScore: result.detection.score,
          faceWidth: Math.round(width),
          faceHeight: Math.round(height),
        },
      });

      // Require another blink for the next capture.
      blinkVerifiedRef.current = false;
      blinkClosedRef.current = false;
      setBlinkDetected(false);
      setBlinkStatus("Face captured. Blink again to enable another capture.");

      toast.success("Face descriptor generated. Review and save the employee.");
    } catch (err) {
      setError(err.message || "Unable to enroll this face.");
      toast.error(err.message || "Face enrollment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Face enrollment</h2>
        <p className="mt-1 text-sm text-slate-500">
          Obtain the employee's consent before capturing biometric data. Use
          good lighting, face the camera, and keep only one person in the frame.
          A natural blink is required before capture.
        </p>
      </div>

    
<div className="relative w-full overflow-hidden rounded-xl bg-slate-950">
 <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="block aspect-[4/3] w-full object-fill"
  />

  <canvas
    ref={canvasRef}
    className="pointer-events-none absolute inset-0 z-10 h-full w-full"
  />

  <div className="absolute bottom-2 left-2 z-20 rounded-lg bg-black/75 px-3 py-2 text-xs text-white">
    <span className="text-green-400">●</span> Face landmarks
    <span className="ml-3 text-red-400">●</span> Eyes closed
  </div>
</div>


      <div
        role="status"
        aria-live="polite"
        className={`rounded-lg p-3 text-sm font-medium ${
          blinkDetected
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-800"
        }`}
      >
        {blinkDetected ? "✓ " : "○ "}
        {blinkStatus}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startCamera}
          disabled={!modelsLoaded || cameraReady}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {modelsLoaded ? "Start camera" : "Loading models…"}
        </button>

        <button
          type="button"
          onClick={captureFace}
          disabled={!modelsLoaded || !cameraReady || !blinkDetected || loading}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Processing…" : "Detect and normalize"}
        </button>

        <button
          type="button"
          onClick={stopCamera}
          disabled={!cameraReady}
          className="rounded-xl bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 disabled:opacity-50"
        >
          Stop camera
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {preview && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            Captured face preview
          </p>
          <img
            src={preview}
            alt="Captured face preview"
            className="h-36 w-36 rounded-xl border object-cover"
          />
        </div>
      )}
    </section>
  );
};

export default FaceEnrollment;
