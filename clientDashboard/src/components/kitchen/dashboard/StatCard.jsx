import Card from "../../shared/ui/Card";

const StatCard = ({ title, value }) => {

    return (

        <Card>

            <h3 className="text-sm text-gray-500">

                {title}

            </h3>

            <p className="text-3xl font-bold mt-2">

                {value}

            </p>

        </Card>

    );

};

export default StatCard;