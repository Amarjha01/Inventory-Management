const Button = ({
    children,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) => {

    const variants = {
        primary: "bg-blue-900 hover:bg-blue-800 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
    };

    return (
        <button
            type={type}
            className={`w-full rounded-xl px-4 py-3 font-medium transition ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;