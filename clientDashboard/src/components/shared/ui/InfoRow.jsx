const InfoRow = ({
    label,
    value,
}) => {

    return (

        <div className="flex justify-between items-start gap-4 py-3 border-b last:border-b-0">

            <p className="text-sm text-gray-500 font-medium">

                {label}

            </p>

            <p className="text-sm font-semibold text-right wrap-break-word">

                {value || "-"}

            </p>

        </div>

    );

};

export default InfoRow;