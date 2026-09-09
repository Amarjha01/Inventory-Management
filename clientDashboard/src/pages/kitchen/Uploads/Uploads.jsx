import React, { useState } from "react";
import {
  FiFileText,
  FiBookOpen,
  FiShoppingBag,
  FiCamera,
} from "react-icons/fi";

import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import PageHeader from "../../../components/shared/ui/PageHeader";
import Card from "../../../components/shared/ui/Card";
import DashboardLayout from "../../../layouts/DashboardLayout.jsx";
import { themes } from "../../../components/shared/ui/Theme";

import CameraCapture from "../../../components/kitchen/uploads/CameraCapture.jsx";

const DOCUMENT_TYPES = [
  {
    id: "gate-in-pass",
    title: "Gate In Pass",
    description: "Capture gate in pass documents",
    icon: FiFileText,
  },
  {
    id: "day-book",
    title: "Day Book",
    description: "Capture daily book records",
    icon: FiBookOpen,
  },
  {
    id: "purchase-bill",
    title: "Purchase Bill",
    description: "Capture purchase bills and invoices",
    icon: FiShoppingBag,
  },
];

const Uploads = () => {
  const [selectedType, setSelectedType] =
    useState(null);

  const [capturedFile, setCapturedFile] =
    useState(null);

  // ==========================================================
  // OPEN CAMERA
  // ==========================================================

  const openCamera = (documentType) => {
    setSelectedType(documentType);
    setCapturedFile(null);
  };

  // ==========================================================
  // CAMERA CAPTURED
  // ==========================================================

  const handleCapture = (file) => {
    console.log(
      "Captured document:",
      selectedType,
      file,
    );

    setCapturedFile(file);

    // Camera can be closed here if you want
    // to show preview on this page.
    setSelectedType(null);
  };

  // ==========================================================
  // CLOSE CAMERA
  // ==========================================================

  const closeCamera = () => {
    setSelectedType(null);
  };

  return (
    <DashboardLayout>
      <ThemeProvider
        theme={themes.DOWNLOADS}
        className="min-h-full pb-24"
      >
        <div className="min-h-full bg-[#F3FAF7]">

          {/* ==================================================
              HEADER
          ================================================== */}

          <PageHeader
            title="Uploads"
            subtitle="Capture and upload documents"
            imageUrl="/ui/DOWNLOADS.png"
          />

            {/* ==================================================
                    DOCUMENT TYPES
                ================================================== */}

            <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-5xl mx-auto">

                <div className="mb-3">
                <h2 className="text-base font-semibold text-[#172B24]">
                    Select Document
                </h2>

                <p className="text-xs text-[#66756F] mt-0.5">
                    Select a document to capture.
                </p>
                </div>

                <div className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
                ">
                {DOCUMENT_TYPES.map((document) => {
                    const Icon = document.icon;

                    return (
                    <button
                        key={document.id}
                        type="button"
                        onClick={() => openCamera(document)}
                        className="
                        group
                        flex
                        items-center
                        gap-3
                        w-full
                        rounded-xl
                        border
                        border-[#D5E9DF]
                        bg-white
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-200
                        hover:border-[#35A96F]
                        hover:bg-[#F8FCFA]
                        hover:shadow-sm
                        active:scale-[0.99]
                        "
                    >
                        {/* ICON */}

                        <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#DDF5E9]
                        text-[#168A5B]
                        transition
                        group-hover:bg-[#168A5B]
                        group-hover:text-white
                        ">
                        <Icon size={20} />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                        <h3 className="
                            text-sm
                            font-semibold
                            text-[#172B24]
                            truncate
                        ">
                            {document.title}
                        </h3>

                        <p className="
                            mt-0.5
                            text-[11px]
                            text-[#66756F]
                            truncate
                        ">
                            {document.description}
                        </p>
                        </div>

                        {/* CAMERA */}

                        <div className="
                        shrink-0
                        rounded-lg
                        bg-[#F3FAF7]
                        p-2
                        text-[#168A5B]
                        group-hover:bg-[#DDF5E9]
                        ">
                        <FiCamera size={16} />
                        </div>
                    </button>
                    );
                })}
                </div>
            </div>
            </div>

          {/* ==================================================
              CAMERA MODAL / FULL SCREEN
          ================================================== */}

          {selectedType && (
            <CameraCapture
              documentType={selectedType}
              onCapture={handleCapture}
              onClose={closeCamera}
            />
          )}

        </div>
      </ThemeProvider>
    </DashboardLayout>
  );
};

export default Uploads;
