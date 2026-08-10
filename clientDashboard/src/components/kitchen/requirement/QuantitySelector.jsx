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

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={decrease}
                disabled={value <= bagSize}
                className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center disabled:opacity-50"
            >
                <FiMinus />
            </button>

            <span className="font-semibold w-12 text-center">
                {value}
            </span>

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