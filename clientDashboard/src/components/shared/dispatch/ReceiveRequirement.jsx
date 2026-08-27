import { useRef, useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";

const ReceiveRequirement = ({ loading = false, onReceive }) => {
  const [gatePass, setGatePass] = useState([]);

  const fileInputRef = useRef(null);

  const handleSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    setGatePass((prevFiles) => {
      const combinedFiles = [...prevFiles, ...selectedFiles];

      if (combinedFiles.length > 2) {
        alert("You can upload maximum 2 gate pass images.");
        return prevFiles;
      }

      return combinedFiles;
    });

    // Important: allows selecting the same file again
    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setGatePass((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Receive Requirement
      </h2>

      <p className="text-sm text-gray-500 mt-2 mb-6">
        Upload gate pass before marking this requirement as received.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {gatePass.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-blue-300 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-5xl mb-3">📷</div>

          <h3 className="font-semibold text-lg">
            Select Gate Pass Images
          </h3>

          <p className="text-gray-500 mt-2">
            Select 1 or 2 images
          </p>

          <p className="text-xs text-gray-400 mt-1">
            JPG • PNG • WEBP
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gatePass.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="relative"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Gate Pass ${index + 1}`}
                  className="w-full h-72 object-contain rounded-xl border bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1"
                >
                  Remove
                </button>

                <p className="text-sm text-gray-600 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          {gatePass.length < 2 && (
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Add Another Image
            </Button>
          )}
        </div>
      )}

      <Button
        className="w-full mt-6"
        disabled={gatePass.length === 0 || loading}
        onClick={() => onReceive(gatePass)}
      >
        {loading ? "Uploading..." : "Mark as Received ( सामान प्राप्त हुआ )"}
      </Button>
    </Card>
  );
};

export default ReceiveRequirement;