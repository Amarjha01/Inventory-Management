import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiCamera,
  FiX,
  FiRefreshCw,
  FiCheck,
  FiZap,
  FiAlertCircle,
} from "react-icons/fi";

const CameraCapture = ({
  onCapture,
  onClose,
  documentType,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [facingMode, setFacingMode] =
    useState("environment");

  const [preview, setPreview] =
    useState(null);

  // ==========================================================
  // DOCUMENT NAME
  // ==========================================================

  const documentName =
    documentType?.title || "Document";

  // ==========================================================
  // START CAMERA
  // ==========================================================

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();

      if (preview?.url) {
        URL.revokeObjectURL(
          preview.url,
        );
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setLoading(true);
      setCameraError("");

      stopCamera();

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser.",
        );

        setLoading(false);
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: facingMode,
              },

              width: {
                ideal: 720,
                min: 720,
              },

              height: {
                ideal: 1080,
                min: 720,
              },

              aspectRatio: {
                ideal: 16 / 9,
              },
            },

            audio: false,
          },
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }
    } catch (error) {
      console.error(
        "Camera error:",
        error,
      );

      if (
        error.name ===
        "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access and try again.",
        );
      } else if (
        error.name ===
        "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device.",
        );
      } else {
        setCameraError(
          "Unable to access the camera.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ==========================================================
  // SWITCH CAMERA
  // ==========================================================

  const switchCamera = () => {
    setFacingMode((current) =>
      current === "environment"
        ? "user"
        : "environment",
    );
  };

  // ==========================================================
  // COMPRESS IMAGE
  // ==========================================================

const compressImage = (
  canvas,
  fileName = "document.jpg",
) => {
  return new Promise((resolve, reject) => {
    const MAX_WIDTH = 3000;
    const MAX_HEIGHT = 3000;

    let width = canvas.width;
    let height = canvas.height;

    // ----------------------------------------------------------
    // Resize only if the image is excessively large
    // ----------------------------------------------------------

    if (
      width > MAX_WIDTH ||
      height > MAX_HEIGHT
    ) {
      const scale = Math.min(
        MAX_WIDTH / width,
        MAX_HEIGHT / height,
      );

      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    // ----------------------------------------------------------
    // Create optimized canvas
    // ----------------------------------------------------------

    const outputCanvas =
      document.createElement("canvas");

    outputCanvas.width = width;
    outputCanvas.height = height;

    const context =
      outputCanvas.getContext("2d", {
        alpha: false,
      });

    // Better quality resizing
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // White background prevents transparent/black areas
    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.drawImage(
      canvas,
      0,
      0,
      width,
      height,
    );

    // ----------------------------------------------------------
    // JPEG compression
    // ----------------------------------------------------------

    outputCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              "Unable to compress image.",
            ),
          );
          return;
        }

        const file = new File(
          [blob],
          fileName,
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          },
        );

        resolve(file);
      },
      "image/jpeg",
      0.92,
    );
  });
};

  // ==========================================================
  // CAPTURE IMAGE
  // ==========================================================

  const captureImage = async () => {
    try {
      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      if (!video || !canvas) {
        return;
      }

      const width =
        video.videoWidth;

      const height =
        video.videoHeight;

      if (!width || !height) {
        setCameraError(
          "Camera is not ready yet.",
        );

        return;
      }

      /*
       * Keep the original camera resolution.
       *
       * This is important for documents because
       * reducing the resolution too aggressively
       * makes small text blurry.
       */

      canvas.width = width;
      canvas.height = height;

      const context =
        canvas.getContext("2d", {
          alpha: false,
        });

      context.imageSmoothingEnabled =
        true;

      context.imageSmoothingQuality =
        "high";

      /*
       * Mirror only the front camera.
       */

      if (facingMode === "user") {
        context.save();

        context.translate(
          width,
          0,
        );

        context.scale(-1, 1);

        context.drawImage(
          video,
          0,
          0,
          width,
          height,
        );

        context.restore();
      } else {
        context.drawImage(
          video,
          0,
          0,
          width,
          height,
        );
      }

      const file =
        await compressImage(
          canvas,
          `${documentType?.id || "document"}-${Date.now()}.jpg`,
        );

      const previewUrl =
        URL.createObjectURL(file);

      setPreview({
        file,
        url: previewUrl,
      });

      stopCamera();
    } catch (error) {
      console.error(
        "Capture error:",
        error,
      );

      setCameraError(
        "Unable to capture the document.",
      );
    }
  };

  // ==========================================================
  // RETAKE
  // ==========================================================

  const retake = async () => {
    if (preview?.url) {
      URL.revokeObjectURL(
        preview.url,
      );
    }

    setPreview(null);

    await startCamera();
  };

  // ==========================================================
  // USE PHOTO
  // ==========================================================

  const usePhoto = () => {
    if (!preview?.file) {
      return;
    }

    onCapture(
      preview.file,
      documentType,
    );

    if (preview.url) {
      URL.revokeObjectURL(
        preview.url,
      );
    }

    setPreview(null);

    onClose();
  };

  // ==========================================================
  // CLOSE
  // ==========================================================

  const handleClose = () => {
    stopCamera();

    if (preview?.url) {
      URL.revokeObjectURL(
        preview.url,
      );
    }

    onClose();
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="
      fixed
      inset-0
      z-[100]
      bg-black
      flex
      items-center
      justify-center
    ">

      <div className="
        relative
        w-full
        h-full
        bg-black
        overflow-hidden
        flex
        flex-col
        sm:max-w-3xl
        sm:h-[95vh]
        sm:rounded-2xl
        sm:shadow-2xl
      ">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="
          absolute
          top-0
          left-0
          right-0
          z-20
          px-3
          py-3
          bg-gradient-to-b
          from-black/70
          to-transparent
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            {/* CLOSE */}

            <button
              type="button"
              onClick={handleClose}
              className="
                h-9
                w-9
                rounded-full
                bg-black/40
                backdrop-blur
                text-white
                flex
                items-center
                justify-center
                hover:bg-black/60
              "
            >
              <FiX size={20} />
            </button>

            {/* TITLE */}

            <div className="
              absolute
              left-1/2
              -translate-x-1/2
              text-center
              text-white
              min-w-0
              max-w-[55%]
            ">
              <p className="
                text-[10px]
                uppercase
                tracking-wider
                text-white/60
              ">
                Capture
              </p>

              <h2 className="
                text-sm
                font-semibold
                truncate
              ">
                {documentName}
              </h2>
            </div>

            {/* CAMERA SWITCH */}

            {!preview && (
              <button
                type="button"
                onClick={switchCamera}
                className="
                  h-9
                  w-9
                  rounded-full
                  bg-black/40
                  backdrop-blur
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-black/60
                "
              >
                <FiRefreshCw
                  size={18}
                />
              </button>
            )}

            {preview && (
              <div className="w-9" />
            )}

          </div>
        </header>

        {/* ==================================================
            CAMERA AREA
        ================================================== */}

        <div className="
          relative
          flex-1
          min-h-0
          bg-[#111]
          flex
          items-center
          justify-center
          overflow-hidden
        ">

          {preview ? (
            <>
              {/* CAPTURED IMAGE */}

              <img
                src={preview.url}
                alt="Captured document"
                className="
                  w-full
                  h-full
                  object-contain
                  bg-black
                "
              />

              {/* PREVIEW LABEL */}

              <div className="
                absolute
                top-16
                left-1/2
                -translate-x-1/2
                rounded-full
                bg-black/60
                backdrop-blur
                px-3
                py-1.5
                text-xs
                text-white
              ">
                Review document
              </div>
            </>
          ) : (
            <>
              {/* VIDEO */}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="
                  w-full
                  h-full
                  object-cover
                "
                style={{
                  transform:
                    facingMode ===
                    "user"
                      ? "scaleX(-1)"
                      : "none",
                }}
              />

              {/* =================================================
                  DOCUMENT SCANNER OVERLAY
              ================================================= */}
        <div>
            <img src={preview?.url} alt="" />
        </div>
              {!loading &&
                !cameraError && (
                  <div className="
                    absolute
                    inset-0
                    pointer-events-none
                  ">

                    {/* DARK OUTSIDE AREA */}

                    <div className="
                      absolute
                      inset-0
                      bg-black/20
                    " />

                    {/* DOCUMENT FRAME */}

                    <div className="
                      absolute
                      left-[6%]
                      right-[6%]
                      top-[18%]
                      bottom-[18%]
                      sm:left-[10%]
                      sm:right-[10%]
                      sm:top-[15%]
                      sm:bottom-[15%]
                    ">

                      {/* TOP LEFT */}

                      <span className="
                        absolute
                        left-0
                        top-0
                        w-7
                        h-7
                        border-l-[3px]
                        border-t-[3px]
                        border-[#35A96F]
                        rounded-tl-md
                      " />

                      {/* TOP RIGHT */}

                      <span className="
                        absolute
                        right-0
                        top-0
                        w-7
                        h-7
                        border-r-[3px]
                        border-t-[3px]
                        border-[#35A96F]
                        rounded-tr-md
                      " />

                      {/* BOTTOM LEFT */}

                      <span className="
                        absolute
                        left-0
                        bottom-0
                        w-7
                        h-7
                        border-l-[3px]
                        border-b-[3px]
                        border-[#35A96F]
                        rounded-bl-md
                      " />

                      {/* BOTTOM RIGHT */}

                      <span className="
                        absolute
                        right-0
                        bottom-0
                        w-7
                        h-7
                        border-r-[3px]
                        border-b-[3px]
                        border-[#35A96F]
                        rounded-br-md
                      " />

                      {/* CENTER GUIDE */}

                      <div className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      ">
                        <div className="
                          rounded-full
                          bg-black/50
                          backdrop-blur-sm
                          px-3
                          py-1.5
                          text-[11px]
                          text-white
                        ">
                          Align all 4 corners
                        </div>
                      </div>

                    </div>

                    {/* INSTRUCTION */}

                    <div className="
                      absolute
                      bottom-[11%]
                      left-0
                      right-0
                      flex
                      justify-center
                      px-4
                    ">
                      <div className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        bg-black/60
                        backdrop-blur-sm
                        px-3
                        py-2
                        text-[11px]
                        text-white
                      ">
                        <FiAlertCircle
                          size={14}
                          className="text-[#7BE0A9]"
                        />

                        Keep the entire page
                        inside the frame
                      </div>
                    </div>

                  </div>
                )}

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (
                <div className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/50
                ">
                  <div className="
                    text-center
                    text-white
                  ">
                    <FiCamera
                      size={30}
                      className="
                        mx-auto
                        mb-2
                        opacity-70
                      "
                    />

                    <p className="text-sm">
                      Starting camera...
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              {cameraError && (
                <div className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  p-5
                  bg-black/70
                ">
                  <div className="
                    max-w-sm
                    text-center
                    text-white
                  ">

                    <FiAlertCircle
                      size={36}
                      className="
                        mx-auto
                        mb-3
                        text-red-400
                      "
                    />

                    <p className="
                      text-sm
                      leading-5
                    ">
                      {cameraError}
                    </p>

                    <button
                      type="button"
                      onClick={
                        startCamera
                      }
                      className="
                        mt-4
                        rounded-lg
                        bg-[#168A5B]
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                      "
                    >
                      Try Again
                    </button>

                  </div>
                </div>
              )}
            </>
          )}

          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        {/* ==================================================
            BOTTOM CONTROLS
        ================================================== */}

        <div className="
          shrink-0
          bg-[#123B32]
          px-4
          py-3
          pb-[max(12px,env(safe-area-inset-bottom))]
        ">

          {preview ? (
            <div className="
              grid
              grid-cols-2
              gap-2
              max-w-md
              mx-auto
            ">

              {/* RETAKE */}

              <button
                type="button"
                onClick={retake}
                className="
                  h-11
                  rounded-xl
                  bg-white/10
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-medium
                  hover:bg-white/20
                "
              >
                <FiRefreshCw
                  size={17}
                />

                Retake
              </button>

              {/* USE */}

              <button
                type="button"
                onClick={usePhoto}
                className="
                  h-11
                  rounded-xl
                  bg-[#168A5B]
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-semibold
                  hover:bg-[#0F6B47]
                "
              >
                <FiCheck
                  size={17}
                />

                Use Photo
              </button>

            </div>
          ) : (
            <div className="
              relative
              flex
              items-center
              justify-center
              max-w-md
              mx-auto
            ">

              {/* FLASH / FUTURE */}

              <div className="
                absolute
                left-0
              ">
                <button
                  type="button"
                  className="
                    h-10
                    w-10
                    rounded-full
                    bg-white/10
                    text-white/70
                    flex
                    items-center
                    justify-center
                  "
                  title="Flash"
                >
                  <FiZap size={17} />
                </button>
              </div>

              {/* CAPTURE */}

              <button
                type="button"
                onClick={
                  captureImage
                }
                disabled={
                  loading ||
                  !!cameraError
                }
                className="
                  relative
                  h-[66px]
                  w-[66px]
                  rounded-full
                  bg-white
                  border-[4px]
                  border-[#35A96F]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  transition
                  active:scale-95
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <span className="
                  h-[50px]
                  w-[50px]
                  rounded-full
                  bg-[#168A5B]
                " />
              </button>

              {/* INFO */}

              <div className="
                absolute
                right-0
                text-right
              ">
                <p className="
                  text-[10px]
                  text-white/50
                ">
                  PHOTO
                </p>

                <p className="
                  text-[11px]
                  font-medium
                  text-white
                ">
                  High Quality
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
