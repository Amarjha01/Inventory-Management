import Card from "../../shared/ui/Card";

const RequirementItemCard = ({
    item,
    inventoryItem,
    onQuantityChange
}) => {

    return (

        <Card>

            <div className="flex gap-4">

                <img
                    src={`/items/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">

                    <h3 className="font-semibold">

                        {item.name}

                    </h3>

                    <p className="text-sm text-gray-500">

                        {item.hindiName}

                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-4">

                        <div>

                            <p className="text-xs text-gray-500">

                                Requested

                            </p>

                            <p className="font-semibold">

                                {item.requestedQuantity} {item.unit}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-gray-500">

                                Available Stock

                            </p>

                            <p className="font-semibold text-green-600">

                                {inventoryItem?.currentStock ?? 0} {item.unit}

                            </p>

                        </div>

                    </div>

                    <div className="mt-5">

                        <label className="text-sm font-medium">

                            Dispatch Quantity

                        </label>

                        <input
                            type="number"
                            value={item.dispatchedQuantity}
                            onChange={(e)=>
                                onQuantityChange(
                                    item.itemId,
                                    Number(e.target.value)
                                )
                            }
                            className="mt-2 w-full border rounded-xl p-3 outline-none"
                        />

                    </div>

                </div>

            </div>

        </Card>

    );

};

export default RequirementItemCard;