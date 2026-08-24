import { useRef, useState } from "react";
import { FiCamera, FiUpload, FiX } from "react-icons/fi";
import { updateGatePassImage } from "../../../services/requirement.service";

const base_url = import.meta.env.VITE_SERVER_BASE_URL;

const EditGatePassImage = ({ requirement, onSuccess }) => {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);

  const existingGatePasses = requirement?.gatePass || [];

  const handleChangeImage = (index) => {
    setActiveIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file || activeIndex === null) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setSelectedFiles((prev) => {
      const updated = [...prev];
      updated[activeIndex] = file;
      return updated;
    });

    setPreview((prev) => {
      const updated = [...prev];
      updated[activeIndex] = objectUrl;
      return updated;
    });

    e.target.value = "";
  };

  const handleRemoveSelected = (index) => {
    if (preview[index]) {
      URL.revokeObjectURL(preview[index]);
    }

    setPreview((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    setSelectedFiles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handleUpdate = async () => {
    const files = selectedFiles.filter(Boolean);

    if (!files.length) return;

    try {
      setLoading(true);

      const formData = new FormData();

      /*
       * Build final images:
       * - use newly selected image if available
       * - otherwise use existing image
       */
      for (let i = 0; i < 2; i++) {
        if (selectedFiles[i]) {
          formData.append("gatePass", selectedFiles[i]);
        }
      }

      const updatedRequirement = await updateGatePassImage(
        requirement._id,
        formData
      );

      alert("Gate pass images updated successfully.");

      preview.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });

      setSelectedFiles([]);
      setPreview([]);
      setActiveIndex(null);

      onSuccess?.(updatedRequirement);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update gate pass images."
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageForSlot = (index) => {
    // New selected image
    if (preview[index]) {
      return preview[index];
    }

    // Existing image
    if (existingGatePasses[index]?.image) {
      return `${base_url}/uploads/requirements/${existingGatePasses[index].image}`;
    }

    return null;
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Gate Pass
        </h3>

        <p className="text-sm text-gray-500">
          Upload up to 2 gate pass images.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[0, 1].map((index) => {
          const image = getImageForSlot(index);
          const hasNewImage = Boolean(preview[index]);
          const hasExistingImage = Boolean(
            existingGatePasses[index]?.image
          );

          return (
            <div
              key={index}
              className="rounded-xl border overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                {image ? (
                  <img
                    src={image}
                    alt={`Gate Pass ${index + 1}`}
                    className="w-full h-72 object-contain bg-gray-50"
                  />
                ) : (
                  <div className="w-full h-72 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <FiCamera className="text-4xl mb-2" />

                    <p>No image uploaded</p>
                  </div>
                )}

                {hasNewImage && (
                  <span className="absolute top-2 left-2 rounded-lg bg-green-600 px-2 py-1 text-xs font-medium text-white">
                    New Image
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="p-3">
                <p className="font-medium text-gray-800 mb-3">
                  Gate Pass {index + 1}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChangeImage(index)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiUpload />

                    {image ? "Change Image" : "Add Image"}
                  </button>

                  {hasNewImage && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(index)}
                      disabled={loading}
                      className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update */}
      {selectedFiles.some(Boolean) && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiCamera />

          {loading
            ? "Updating..."
            : "Update Gate Pass Images"}
        </button>
      )}
    </div>
  );
};

export default EditGatePassImage;