import { useState } from "react";
import { Link } from "react-router-dom";

import {
    MdMenu,
    MdClose,
    MdAssignment,
    MdInventory,
    MdDirectionsCar,
    MdPeople,
    MdSettings
} from "react-icons/md";

const MainStoreNavbar = () => {

    const [open, setOpen] = useState(false);

    const menus = [

        {
            title: "Requirements",
            icon: <MdAssignment size={22} />,
            path: "/store/requirements"
        },

        {
            title: "Inventory",
            icon: <MdInventory size={22} />,
            path: "/store/inventory"
        },

        {
            title: "Vehicles",
            icon: <MdDirectionsCar size={22} />,
            path: "/store/vehicles"
        },

        {
            title: "Drivers",
            icon: <MdPeople size={22} />,
            path: "/store/drivers"
        },

        {
            title: "Settings",
            icon: <MdSettings size={22} />,
            path: "/store/settings"
        }

    ];

    return (

        <>

            <header className="sticky top-0 z-50 bg-white shadow-sm">

                <div className="h-16 px-4 flex items-center justify-between">

                    <button
                        onClick={() => setOpen(true)}
                    >

                        <MdMenu size={28} />

                    </button>

                    <div>

                        <h2 className="font-bold">

                            Main Store

                        </h2>

                        <p className="text-xs text-gray-500">

                            Hajipur Cold Store

                        </p>

                    </div>

                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white">

                        S

                    </div>

                </div>

            </header>

            {

                open && (

                    <>

                        <div
                            className="fixed inset-0 bg-black/40 z-40"
                            onClick={() => setOpen(false)}
                        />

                        <aside className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg">

                            <div className="flex items-center justify-between h-16 px-4 border-b">

                                <h2 className="font-semibold">

                                    Main Store

                                </h2>

                                <button
                                    onClick={() => setOpen(false)}
                                >

                                    <MdClose size={24} />

                                </button>

                            </div>

                            <div className="py-3">

                                {

                                    menus.map(menu => (

                                        <Link
                                            key={menu.path}
                                            to={menu.path}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100"
                                        >

                                            {menu.icon}

                                            <span>

                                                {menu.title}

                                            </span>

                                        </Link>

                                    ))

                                }

                            </div>

                        </aside>

                    </>

                )

            }

        </>

    );

};

export default MainStoreNavbar;