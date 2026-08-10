import { FiMinus, FiPlus } from "react-icons/fi";
import { GiChipsBag } from "react-icons/gi";
const QuantitySelector = ({ bagSize, value, onChange }) => {

    const increase = () => onChange(value + bagSize);

    const decrease = () => {
        if (value > 1) {
            onChange(value - 1);
        }
    };

    return (

        <div className="flex items-center gap-3">

            <button
                onClick={decrease}
                className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center"
            >
                <FiMinus />
            </button>

            <span className="font-semibold w-8 text-center">
                {value}
            </span>

            <button
                onClick={increase}
                className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center"
            >
                <FiPlus />
            </button>
        </div>

    );
};

export default QuantitySelector;