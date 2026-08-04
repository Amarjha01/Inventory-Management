import DashboardLayout from "../../../layouts/DashboardLayout";
import PageHeader from "../../../components/shared/ui/PageHeader";
import StatCard from "../../../components/kitchen/dashboard/StatCard";
import QuickAction from "../../../components/kitchen/dashboard/QuickAction";
import dashboard from "../../../mock/dashboard";

import {
    MdInventory,
    MdHistory,
    MdLocalShipping
} from "react-icons/md";

const Dashboard = () => {

    return (

        <DashboardLayout>

            <PageHeader
                title="Dashboard"
                subtitle="Inventory Overview"
            />

            <div className="grid grid-cols-2 gap-4">

                <StatCard
                    title="Pending"
                    value={dashboard.stats.pending}
                />

                <StatCard
                    title="Approved"
                    value={dashboard.stats.approved}
                />

                <StatCard
                    title="Dispatched"
                    value={dashboard.stats.dispatched}
                />

                <StatCard
                    title="Completed"
                    value={dashboard.stats.completed}
                />

            </div>

            <div className="mt-8 space-y-4">

                <QuickAction
                    title="New Requirement"
                    icon={<MdInventory size={24} />}
                    to="/new-requirement"
                />

                <QuickAction
                    title="Previous Requirements"
                    icon={<MdHistory size={24} />}
                    to="/previous-requirements"
                />

                <QuickAction
                    title="Track Dispatch"
                    icon={<MdLocalShipping size={24} />}
                    to="/track"
                />

            </div>

        </DashboardLayout>

    );

};

export default Dashboard;