import { storage } from "../../../utils/storage";

const Navbar = () => {
  const user = storage.getUser();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-5">
        {/* Left */}
        <div className="flex items-center gap-4">
          <img
            src="/ESF_full_logo.avif"
            alt="ESF Logo"
            className="h-10 w-auto object-contain hidden md:block"
          />
          <img
            src="/ESF_Logo.avif"
            alt="ESF Logo"
            className="h-10 w-auto object-contain  md:hidden"
          />

          <div className="h-8 w-px bg-gray-200" />

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {user?.kitchenId?.name || "Kitchen"}
            </h2>

            <p className="text-xs text-blue-900 font-bold">Ekta Shakti Foundation</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="text-right ">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>

            <p className="text-xs text-green-900 capitalize">{user?.role}</p>
          </div>

          {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-semibold text-white shadow-md">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
