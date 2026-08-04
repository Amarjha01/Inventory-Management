import Badge from "../../shared/ui/Badge";

const RequirementStatusBadge = ({ status }) => {

    const STATUS = {

        SUBMITTED: {
            label: "Submitted",
            color: "blue",
        },

        APPROVED: {
            label: "Approved",
            color: "green",
        },

        PACKING: {
            label: "Packing",
            color: "yellow",
        },

        PACKED: {
            label: "Packed",
            color: "yellow",
        },

        OUT_FOR_DELIVERY: {
            label: "Out For Delivery",
            color: "blue",
        },

        DELIVERED: {
            label: "Delivered",
            color: "green",
        },

        RECEIVED: {
            label: "Received",
            color: "green",
        },

    };

    const current = STATUS[status] || {
        label: status,
        color: "blue",
    };

    return (
        <Badge color={current.color}>
            {current.label}
        </Badge>
    );

};

export default RequirementStatusBadge;