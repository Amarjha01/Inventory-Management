import { Outlet } from "react-router-dom";
import MainStoreNavigation from "../components/mainStore/layout/MainStoreNavigation";

const MainStoreLayout = () => {

    return (

        <div className="min-h-screen bg-gray-50">
            <MainStoreNavigation />

            <main className="px-4 py-5 pb-24">

                <Outlet />

            </main>

           

        </div>

    );

};

export default MainStoreLayout;