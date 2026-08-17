import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiCircle,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import Toast from "../../utils/Toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import { resetPassword } from "../../services/auth.service";

const PasswordResetForm = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = isLengthValid && hasNumber && hasSpecial;

   useEffect(() => {
  const user = storage.getUser();

  if (!user){
    navigate("/login")
  };

  if (user.isFirstLogin) {
    navigate("/resetpass", { replace: true });
    return;
  }

  switch (user.role) {
    case "Kitchen Incharge":
    case "Store Incharge":
      navigate("/new-requirement", { replace: true });
      break;

    case "Store Supervisor":
    case "Admin":
      navigate("/store", { replace: true });
      break;

    default:
      navigate("/login", { replace: true });
  }
}, [navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isPasswordValid) {
    setSubmitted(false);
    return;
  }

  if (password !== confirmPassword) {
    setSubmitted(false);
    return;
  }

  try {
    setSubmitted(false);

    await resetPassword(password);

    setSubmitted(true);

    toast.success("Password reset successfully!");

    // Update local user state/storage if needed
    const user = storage.getUser();

    if (user) {
      storage.setUser({
        ...user,
        isFirstLogin: false,
      });
    }

    navigate("/new-requirement", { replace: true });
  } catch (error) {
    console.error("Password reset failed:", error);

    setSubmitted(false);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password. Please try again."
    );
  }
};


  const getInputClass = (value, valid) => {
    if (!value) {
      return "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    }

    return valid
      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
      : "border-red-500 focus:border-red-500 focus:ring-red-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Create New Password ( नया पासवर्ड बनाएं )
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          Choose a strong password for your account.
          <span>अपने अकाउंट के लिए एक मज़बूत पासवर्ड चुनें।</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="Enter your password"
                className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${getInputClass(
                  password,
                  isPasswordValid
                )}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

            {/* Password warning */}
            <AnimatePresence>
              {password.length > 0 && !isPasswordValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-600"
                >
                  <FiAlertCircle />
                  Password does not meet all requirements.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Requirements */}
            <div className="mt-3 space-y-2 text-sm">
              <PasswordRequirement
                valid={isLengthValid}
                text="At least 8 characters"
              />

              <PasswordRequirement
                valid={hasNumber}
                text="Contains a number"
              />

              <PasswordRequirement
                valid={hasSpecial}
                text="Contains a special character"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="Confirm your password"
                className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${getInputClass(
                  confirmPassword,
                  passwordsMatch
                )}`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

            {/* Password mismatch */}
            <AnimatePresence>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-2 flex items-center gap-2 text-sm text-red-600"
                >
                  <FiAlertCircle />
                  Passwords do not match.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            <FiCheckCircle size={18} />
            Set Password
          </motion.button>

          {/* Success */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700"
              >
                <FiCheckCircle size={20} />
                Password has been successfully set!
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

const PasswordRequirement = ({ valid, text }) => {
  return (
    <motion.div
      animate={{
        color: valid ? "#198754" : "#555",
      }}
      className="flex items-center gap-2"
    >
      <motion.span
        initial={false}
        animate={{
          scale: valid ? 1.1 : 1,
        }}
      >
        {valid ? (
          <FiCheck className="text-green-600" />
        ) : (
          <FiCircle className="text-gray-400" size={15} />
        )}
      </motion.span>

      <span>{text}</span>
    </motion.div>
  );
};

export default PasswordResetForm;