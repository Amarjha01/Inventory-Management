import Card from "../../shared/ui/Card";
import QuantitySelector from "./QuantitySelector";
import { FiTrash2 } from "react-icons/fi";

const ItemCard = ({
    item,
    onQuantityChange,
    onRemove,
}) => {

    return (

        <Card className="flex gap-4">

            <img
                src={`/items/${item.image}`}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1">

                <h3 className="font-semibold">
                    {item.name}
                </h3>

                <p className="text-gray-500 text-sm">
                    {item.hindiName}
                </p>

                <div className="flex items-center justify-between mt-4">

                    <QuantitySelector
                        value={item.requestedQuantity}
                        onChange={onQuantityChange}
                    />

                    <button
                        onClick={onRemove}
                        className="text-red-500"
                    >
                        <FiTrash2 size={20} />
                    </button>

                </div>

            </div>

        </Card>

    );
};

export default ItemCard;