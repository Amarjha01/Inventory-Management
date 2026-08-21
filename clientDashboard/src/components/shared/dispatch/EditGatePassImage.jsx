import { useRef, useState } from "react";
import { FiCamera, FiUpload, FiX } from "react-icons/fi";
import { updateGatePassImage } from "../../../services/requirement.service";
const base_url =  import.meta.env.VITE_SERVER_BASE_URL;
const EditGatePassImage = ({ requirement, onSuccess }) => {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const imageUrl = requirement?.gatePass?.image
    ? `${base_url}/uploads/requirements/${requirement.gatePass.image}`
    : null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("gatePass", selectedFile);

      const updatedRequirement = await updateGatePassImage(
        requirement._id,
        formData
      );

      alert("Gate pass image updated successfully.");

      handleCancel();

      onSuccess?.(updatedRequirement);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update gate pass image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Gate Pass
          </h3>

          <p className="text-sm text-gray-500">
            You can replace the gate pass image.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiUpload />
          Change Image
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image */}
      {(preview || imageUrl) && (
        <div className="relative overflow-hidden rounded-xl border">
          <img
            src={preview || imageUrl}
            alt="Gate Pass"
            className="w-full max-h-[500px] object-contain bg-gray-50"
          />
        </div>
      )}

      {/* Selected file information */}
      {selectedFile && (
        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                New Image Selected
              </p>

              <p className="text-sm text-gray-500">
                {selectedFile.name}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-red-500"
            >
              <FiX />
            </button>
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCamera />

            {loading ? "Updating..." : "Update Gate Pass"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EditGatePassImage;
