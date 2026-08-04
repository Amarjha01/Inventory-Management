import Navbar from "../components/kitchen/layout/Navbar";
import BottomNavigation from "../components/kitchen/layout/BottomNavigation";

const DashboardLayout = ({ children }) => {

    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="px-4 py-5 pb-24">

                {children}

            </main>

            <BottomNavigation />

        </div>

    );

};

export default DashboardLayout;