import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdInventory,
    MdHistory,
    MdLocalShipping
} from "react-icons/md";

const BottomNavigation = () => {

    const menus = [

        // {
        //     title: "Home",
        //     icon: <MdDashboard size={24} />,
        //     path: "/dashboard"
        // },

        {
            title: "New",
            icon: <MdInventory size={24} />,
            path: "/new-requirement"
        },

        {
            title: "History",
            icon: <MdHistory size={24} />,
            path: "/history"
        },

        {
            title: "Track",
            icon: <MdLocalShipping size={24} />,
            path: "/track"
        }

    ];

    return (

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">

            <div className="grid grid-cols-4 h-16">

                {menus.map((menu) => (

                    <NavLink
                        key={menu.path}
                        to={menu.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center text-xs ${
                                isActive
                                    ? "text-teal-600"
                                    : "text-gray-500"
                            }`
                        }
                    >
                        {menu.icon}
                        <span>{menu.title}</span>

                    </NavLink>

                ))}

            </div>

        </nav>

    );

};

export default BottomNavigation;