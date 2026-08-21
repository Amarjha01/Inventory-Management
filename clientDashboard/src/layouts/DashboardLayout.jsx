import Navbar from "../components/kitchen/layout/Navbar";
import BottomNavigation from "../components/kitchen/layout/BottomNavigation";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Requirement Notice */}
      <div className="px-4 pt-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          <p className="font-semibold">
            महत्वपूर्ण सूचना
          </p>

          <p className="mt-1">
            आज आपके द्वारा जो भी REQUIREMENT डाली जा रही है, उसकी SUPPLY अगले दिन की जाएगी।
          </p>
        </div>
      </div>

      <main className="px-4 py-5 pb-24">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;
