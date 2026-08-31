const Card = ({
  children,
  className = "",
  padding = "normal",
  hover = false,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    small: "p-3",
    normal: "p-4 sm:p-5",
    large: "p-5 sm:p-6",
  };

  return (
    <div
      {...props}
      className={`
        w-full
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        ${paddingClasses[padding] || paddingClasses.normal}
        ${
          hover
            ? `
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:border-gray-200
              hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]
            `
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;