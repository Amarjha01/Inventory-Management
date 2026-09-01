const Input = ({
    label,
    error,
    className = "",
    ...props
}) => {
    return (
        <div className="space-y-2">

            {label && (
                <label className="text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                className={`w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                {...props}
            />

            {error && (
                <p className="text-red-500 text-sm">
                    {error}
                </p>
            )}

        </div>
    );
};

export default Input;