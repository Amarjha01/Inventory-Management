import { storage } from "../../../utils/storage";

const Navbar = () => {
    const user = storage.getUser();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

            <div className="flex items-center justify-between px-4 h-16">

                <div>

                    <h2 className="text-lg font-semibold text-gray-800">
                        {user?.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {user?.role}
                    </p>

                </div>

                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0)}
                </div>

            </div>

        </header>
    );
};

export default Navbar;