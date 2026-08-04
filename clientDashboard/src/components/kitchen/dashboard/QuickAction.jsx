import { Link } from "react-router-dom";
import Card from "../../shared/ui/Card";

const QuickAction = ({ title, icon, to }) => {

    return (

        <Link to={to}>

            <Card className="flex items-center justify-between my-2">

                <div className="flex items-center gap-3">

                    {icon}

                    <span className="font-medium">

                        {title}

                    </span>

                </div>

                <span>›</span>

            </Card>

        </Link>

    );

};

export default QuickAction;