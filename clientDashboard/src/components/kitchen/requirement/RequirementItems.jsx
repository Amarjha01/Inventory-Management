import Card from "../../shared/ui/Card";

const RequirementItems = ({ items }) => {
console.log(items);

    return (

        <Card>

            <h2 className="text-lg font-semibold mb-5">

                Requested Items

            </h2>

            <div className="space-y-4">

                {

                    items.map(item => (

                        <div
                            key={item.inventoryId._id}
                            className="flex justify-between items-center"
                        >

                            <div className="flex gap-3 items-center">

                                <img
                                    src={`/items/${item.inventoryId.image}`}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-xl object-cover"
                                />

                                <div>

                                    <p className="font-medium">

                                        {item.inventoryId.name}

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        {item.inventoryId.hindiName}

                                    </p>

                                </div>

                            </div>

                            <div className="text-right">

                                <p className="font-semibold">

                                    {item.quantity}

                                </p>

                                <p className="text-xs text-gray-500">

                                    {item.unit}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </Card>

    );

};

export default RequirementItems;