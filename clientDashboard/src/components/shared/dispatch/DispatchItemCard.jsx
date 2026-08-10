const DispatchItemCard = ({
    item,
}) => {

    return (

        <div className="border rounded-xl p-4">

            <div className="flex gap-4">

                <img
                    src={`/items/${item.inventoryId.image}`}
                    alt={item.inventoryId.name}
                    className="w-16 h-16 rounded-lg"
                />

                <div className="flex-1">

                    <h4 className="font-semibold">

                        {item.inventoryId.name}

                    </h4>

                    <p className="text-sm text-gray-500">

                        {item.inventoryId.hindiName}

                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-4">

                        <div>

                            <p className="text-xs text-gray-500">

                                Requested

                            </p>

                            <p className="font-semibold">

                                {item.quantity} {item.unit}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-gray-500">

                                Dispatched

                            </p>

                            <p className="font-semibold text-blue-600">

                                {item.dispatchedQuantity} {item.unit}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default DispatchItemCard;