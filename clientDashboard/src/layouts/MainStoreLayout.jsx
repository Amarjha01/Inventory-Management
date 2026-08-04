import { Outlet } from "react-router-dom";
import MainStoreNavbar from "../components/mainStore/layout/MainStoreNavbar";
import MainStoreBottomNavigation from "../components/mainStore/layout/MainStoreBottomNavigation";

const MainStoreLayout = () => {

    return (

        <div className="min-h-screen bg-gray-50">

            <MainStoreNavbar />

            <main className="px-4 py-5 pb-24">

                <Outlet />

            </main>

            <MainStoreBottomNavigation />

        </div>

    );

};

export default MainStoreLayout;