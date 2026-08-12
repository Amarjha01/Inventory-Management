import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/shared/ui/Button";
import Card from "../../components/shared/ui/Card";
import Input from "../../components/shared/ui/Input";
import { login } from "../../services/auth.service";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import Toast from "../../utils/Toast";
import toast from "react-hot-toast";
import { storage } from "../../utils/storage";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await login(phone, password);
        toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(response));

      switch (response.role) {
        case "Kitchen Incharge":
        case "Store Incharge":
          navigate("/new-requirement");
          break;

        case "Store Supervisor":
        case "Admin":
          navigate("/store");
          break;

        default:
          navigate("/login");
      }
    } catch (err) {
            toast.error(`Invalid phone number or password.`);  
      setError(err?.message || "Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
     const user = storage.getUser();
     if(user){
        switch (user.role) {
        case "Kitchen Incharge":
        case "Store Incharge":
          navigate("/new-requirement");
          break;

        case "Store Supervisor":
        case "Admin":
          navigate("/store");
          break;

        default:
          navigate("/login");
      }
     }
  })
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-8">
      {/* Background decorations */}

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center">
            <TbLockPassword className="text-white text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>

          <p className="text-blue-100/60 text-sm mt-1">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full !bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/30 border border-white/20 rounded-3xl p-6 sm:p-8">
          <div className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-sm" />

                <Input
                  type="tel"
                  value={phone}
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  className="!pl-11"
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <TbLockPassword className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-lg" />

                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  className="!pl-11 !pr-12"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleLogin();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                  !
                </div>

                <p className="text-sm text-red-600 leading-5">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              className="w-full !mt-7 !h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Secure access to your management dashboard
            </p>
          </div>
        </Card>

        {/* Bottom branding */}
        <p className="text-center text-xs text-blue-100/40 mt-6">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
