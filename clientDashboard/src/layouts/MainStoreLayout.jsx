import { Outlet } from "react-router-dom";
import MainStoreNavigation from "../components/mainStore/layout/MainStoreNavigation";
import Toast from "../utils/Toast";

const MainStoreLayout = () => {

    return (

        <div className="min-h-screen bg-gray-50">
            <MainStoreNavigation />

            <main className="px-4 py-5 pb-24">
                    <Toast />
                <Outlet />

            </main>

           

        </div>

    );

};

export default MainStoreLayout;