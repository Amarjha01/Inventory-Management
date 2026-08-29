import Card from "../ui/Card";
import DispatchItemCard from "./DispatchItemCard";

const DispatchItems = ({
    items,
}) => {

    return (

        <Card>

            <h3 className="text-lg font-semibold mb-5">

                Dispatched Items

            </h3>

            <div className="space-y-4">

                {

                    items.map(item => (

                        <DispatchItemCard
                            key={item?.inventoryId?._id}
                            item={item}
                        />

                    ))

                }

            </div>

        </Card>

    );

};

export default DispatchItems;