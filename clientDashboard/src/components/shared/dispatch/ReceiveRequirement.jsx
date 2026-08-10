import { useRef, useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";

const ReceiveRequirement = ({ loading = false, onReceive }) => {
  const [gatePass, setGatePass] = useState(null);

  const fileInputRef = useRef(null);

  const handleSelect = (e) => {
    if (e.target.files?.length) {
      setGatePass(e.target.files[0]);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold">Receive Requirement</h2>

      <p className="text-sm text-gray-500 mt-2 mb-6">
        Upload gate pass before marking this requirement as received.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />

      {!gatePass ? (
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer border-2 border-dashed border-blue-300 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-5xl mb-3">📷</div>

          <h3 className="font-semibold text-lg">Select Gate Pass</h3>

          <p className="text-gray-500 mt-2">Click here to choose an image</p>

          <p className="text-xs text-gray-400 mt-1">JPG • PNG • WEBP</p>
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={URL.createObjectURL(gatePass)}
            alt="Gate Pass"
            className="w-full h-72 object-contain rounded-xl border bg-gray-50"
          />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{gatePass.name}</p>

              <p className="text-sm text-gray-500">
                {(gatePass.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <Button onClick={() => fileInputRef.current.click()}>
              Change Image
            </Button>
          </div>
        </div>
      )}

      <Button
        className="w-full mt-6"
        disabled={!gatePass || loading}
        onClick={() => onReceive(gatePass)}
      >
        {loading ? "Uploading..." : "Mark as Received"}
      </Button>
    </Card>
  );
};

export default ReceiveRequirement;
