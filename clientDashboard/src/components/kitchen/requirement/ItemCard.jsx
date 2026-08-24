import Card from "../../shared/ui/Card";
import QuantitySelector from "./QuantitySelector";
import { FiTrash2 } from "react-icons/fi";

const ItemCard = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <Card
      className="
        !rounded-none
        !border-0
        !border-b
        !border-gray-100
        !shadow-none
        !bg-white
        flex
        items-center
        gap-3
        px-0
        py-3
      "
    >
      {/* Image */}
      <img
        src={`/items/${item.image}`}
        alt={item.name}
        className="
          h-14
          w-20
          shrink-0
          rounded-xl
          border
          object-cover

          sm:h-17
          sm:w-25
        "
      />

      {/* Name */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[14px] font-bold text-[#17213b] sm:text-[16px]">
          {item.name}
        </h3>

        <p className="mt-0.5 truncate text-[12px] text-[#69738b] sm:text-[13px]">
          {item.hindiName}
        </p>
      </div>

      {/* Quantity */}
      <QuantitySelector
        bagSize={item.bagSize}
        value={item.quantity}
        onChange={onQuantityChange}
      />

      {/* Delete */}
      <button
        type="button"
        onClick={onRemove}
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-[#ffdfe3]
          bg-[#fff8f8]
          text-[#ff3347]

          sm:h-10
          sm:w-10
        "
      >
        <FiTrash2 size={17} />
      </button>
    </Card>
  );
};

export default ItemCard;