import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ bagSize, value, onChange }) => {
  const [inputValue, setInputValue] = useState(String(value ?? ""));

  // Sync with parent when value changes externally
  useEffect(() => {
    setInputValue(value === "" || value == null ? "" : String(value));
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

    // Don't enforce bagSize while typing
    onChange(Number(newValue));
  };

  const handleBlur = () => {
    const quantity = Number(inputValue);

    // Empty or invalid → restore minimum
    if (!inputValue || Number.isNaN(quantity) || quantity < bagSize) {
      setInputValue(String(bagSize));
      onChange(bagSize);
      return;
    }

    onChange(quantity);
  };

  const currentValue = Number(inputValue) || 0;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={decrease}
        disabled={!inputValue || currentValue <= bagSize}
        className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center disabled:opacity-50"
      >
        <FiMinus />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-20 h-10 text-center text-xl font-semibold border-2 border-teal-500 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
      />

      <button
        type="button"
        onClick={increase}
        className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center"
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;