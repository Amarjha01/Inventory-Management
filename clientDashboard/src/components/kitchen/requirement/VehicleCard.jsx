import Card from "../../shared/ui/Card";

const VehicleCard = ({ vehicle }) => {

    return (

        <Card>

            <h2 className="text-lg font-semibold mb-4">

                Vehicle Information

            </h2>

            {

                !vehicle ? (

                    <div className="text-center py-6 text-gray-500">

                        Vehicle has not been assigned yet.

                    </div>

                ) : (

                    <div className="space-y-4">

                        <div>

                            <p className="text-xs text-gray-500">

                                Vehicle Number

                            </p>

                            <p className="font-medium">

                                {vehicle.number}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-gray-500">

                                Driver Name

                            </p>

                            <p className="font-medium">

                                {vehicle.driverName}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-gray-500">

                                Driver Phone

                            </p>

                            <p className="font-medium">

                                {vehicle.driverPhone}

                            </p>

                        </div>

                    </div>

                )

            }

        </Card>

    );

};

export default VehicleCard;