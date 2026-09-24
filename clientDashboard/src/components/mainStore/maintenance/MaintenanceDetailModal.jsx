import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

import ServiceDetails from "./ServiceDetails";
import VisitorDetails from "./VisitorDetails";
import PurchaseDetails from "./PurchaseDetails";
import { useState } from "react";

const MaintenanceDetailModal = ({ record, type, onClose }) => {

  const [updatedData , setUpdatedData] = useState()
  /* -------------------------------------------------------
     ESCAPE KEY
  ------------------------------------------------------- */

  useEffect(() => {
    if (!record) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [record, onClose]);

  /* -------------------------------------------------------
     PREVENT BACKGROUND SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    if (!record) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [record]);

  if (!record) return null;

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const titles = {
    service: {
      title: "Service Record",
      hindi: "सर्विस रिकॉर्ड",
    },

    visitor: {
      title: "Visitor Record",
      hindi: "विजिटर रिकॉर्ड",
    },

    purchase: {
      title: "Purchase Record",
      hindi: "परचेज रिकॉर्ड",
    },
  };

  const currentTitle = titles[type] || titles.service;
 console.log("updatedData state changed:", updatedData);
  /* -------------------------------------------------------
     DETAIL COMPONENT
  ------------------------------------------------------- */
  const updatedRecord = (newRecord)=>{
    setUpdatedData(newRecord);
  }
  useEffect(() => {
    if (updatedData) {
      console.log("updatedData state changed:", updatedData);
    }
  }, [updatedData]);
  const renderDetails = () => {
    switch (type) {
      case "service":
        return <ServiceDetails record={record} onUpdateSuccess={updatedRecord} />;

      case "visitor":
        return <VisitorDetails record={record} onClose={onClose}/>;

      case "purchase":
        return <PurchaseDetails record={record} />;

      default:
        return null;
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-3xl
          bg-slate-50
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            shrink-0
            border-b border-slate-200
            bg-white
            px-5 py-4
            sm:px-6 sm:py-5
          "
        >
          <div className="flex items-center justify-between">
            {/* Title */}

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-slate-400
                "
              >
                {type}
              </p>

              <h2
                className="
                  mt-1
                  text-base
                  font-bold
                  text-slate-900
                  sm:text-lg
                "
              >
                {currentTitle.title}
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-400
                "
              >
                {currentTitle.hindi}
              </p>
            </div>

            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-full
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
          "
        >
          {renderDetails()}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailModal;
