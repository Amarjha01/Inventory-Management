import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({ bagSize, value, onChange }) => {
  const increase = () => {
    onChange(value + bagSize);
  };

  const decrease = () => {
    if (value > bagSize) {
      onChange(value - bagSize);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty input while typing
    if (inputValue === "") {
      onChange("");
      return;
    }

    const quantity = Number(inputValue);

    if (!Number.isNaN(quantity) && quantity >= bagSize) {
      onChange(quantity);
    }
  };

  const handleBlur = () => {
    // Prevent invalid/empty quantity after leaving the input
    if (!value || value < bagSize) {
      onChange(bagSize);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={decrease}
        disabled={!value || value <= bagSize}
        className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center disabled:opacity-50"
      >
        <FiMinus />
      </button>

      <input
        type="number"
        min={bagSize}
        step={bagSize}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-16 h-9 text-center font-semibold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
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