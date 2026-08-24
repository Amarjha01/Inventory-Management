import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ bagSize, value, onChange }) => {
  const [inputValue, setInputValue] = useState(String(value ?? ""));

  // Sync with parent when value changes externally
  useEffect(() => {
    setInputValue(
      value === "" || value == null ? "" : String(value)
    );
  }, [value]);

  const increase = () => {
    const currentValue = Number(inputValue) || 0;
    const newValue = currentValue + bagSize;

    setInputValue(String(newValue));
    onChange(newValue);
  };

  const decrease = () => {
    const currentValue = Number(inputValue) || 0;

    if (currentValue > bagSize) {
      const newValue = currentValue - bagSize;

      setInputValue(String(newValue));
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Allow user to completely clear the input
    if (newValue === "") {
      setInputValue("");
      onChange("");
      return;
    }

    // Only allow positive integers
    if (!/^\d+$/.test(newValue)) {
      return;
    }

    setInputValue(newValue);
    onChange(Number(newValue));
  };

  const handleBlur = () => {
    const quantity = Number(inputValue);

    // Empty or invalid → restore minimum
    if (
      !inputValue ||
      Number.isNaN(quantity) ||
      quantity < bagSize
    ) {
      setInputValue(String(bagSize));
      onChange(bagSize);
      return;
    }

    onChange(quantity);
  };

  const currentValue = Number(inputValue) || 0;

  return (
    <div className="flex shrink-0 items-center gap-1">
      {/* Minus */}
      <button
        type="button"
        onClick={decrease}
        disabled={!inputValue || currentValue <= bagSize}
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-md
          bg-gray-100
          text-gray-600
          transition
          hover:bg-gray-200
          disabled:cursor-not-allowed
          disabled:opacity-40

          sm:h-8
          sm:w-8
        "
      >
        <FiMinus className="text-[13px] sm:text-[14px]" />
      </button>

      {/* Quantity Input */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="
          h-8
          w-[48px]
          rounded-md
          border
          border-[#d9dce5]
          bg-white
          text-center
          text-[13px]
          font-bold
          text-[#17213b]
          outline-none
          focus:border-[#7657e8]
          focus:ring-2
          focus:ring-[#7657e8]/10

          sm:h-9
          sm:w-[52px]
          sm:text-[14px]
        "
      />

      {/* Plus */}
      <button
        type="button"
        onClick={increase}
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-md
          bg-[#6337e8]
          text-white
          transition
          hover:bg-[#5428d3]

          sm:h-8
          sm:w-8
        "
      >
        <FiPlus className="text-[13px] sm:text-[14px]" />
      </button>
    </div>
  );
};

export default QuantitySelector;