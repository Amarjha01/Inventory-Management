import Navbar from "../components/kitchen/layout/Navbar";
import BottomNavigation from "../components/kitchen/layout/BottomNavigation";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [showRequirementNotice, setShowRequirementNotice] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

{/* ================= REQUIREMENT NOTICE ================= */}
{showRequirementNotice && (
  <div className="px-2 pt-2 sm:px-4 sm:pt-3">
    <div
      className="
        relative
        flex
        items-center
        rounded-xl
        border
        border-[#f8deda]
        bg-[#fffafa]
        px-2.5
        py-2
        shadow-[0_2px_8px_rgba(220,80,60,0.05)]

        sm:rounded-[20px]
        sm:px-5
        sm:py-2.5
      "
    >
      {/* Icon */}
      <div
        className="
          mr-2
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-[0_2px_8px_rgba(220,80,60,0.10)]
        "
      >
        <FiAlertTriangle
          className="
            text-[17px]
            text-[#ff4b2b]
          "
          strokeWidth={2.2}
        />
      </div>

      {/* Notice Text */}
      <div className="min-w-0 flex-1 pr-5 sm:pr-8">
        <h3
          className="
            text-[12px]
            font-bold
            leading-4
            text-[#c92f20]
          "
        >
          महत्वपूर्ण सूचना
        </h3>

        <p
          className="
            mt-0.5
            text-[9px]
            leading-3.5
            text-gray-800

            sm:mt-1
            sm:text-[13px]
            sm:leading-5
          "
        >
          आज आपके द्वारा जो भी{" "}
          <span className="font-semibold">REQUIREMENT</span> डाली जा रही है,
          उसकी <span className="font-semibold">SUPPLY</span> अगले दिन की जाएगी।
        </p>
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close notice"
        onClick={() => setShowRequirementNotice(false)}
        className="
          absolute
          right-2
          top-1/2
          flex
          h-6
          w-6
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          text-[#17345c]
          transition
          hover:bg-red-50
          hover:text-red-500
          active:scale-90

          sm:right-4
          sm:h-8
          sm:w-8
        "
      >
        <FiX
          className="
            text-[15px]

            sm:text-[21px]
          "
          strokeWidth={2.5}
        />
      </button>
    </div>
  </div>
)}

      <main className="px-4 py-5 pb-24">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;