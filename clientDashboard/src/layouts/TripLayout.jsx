import { Outlet } from "react-router-dom";
import TripNavigation from "../components/trip/TripNavigation.jsx"
import Toast from "../utils/Toast";

const TripLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TripNavigation />

            <main className="px-4 py-5 pb-24">
                <Toast />
                <Outlet />
            </main>
        </div>
    );
};

export default TripLayout;