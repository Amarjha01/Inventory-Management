import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/shared/ProtectedRoute";

import Login from "../pages/auth/Login.jsx";
import Dashboard from "../pages/kitchen/Dashboard/Dashboard.jsx";
import NewRequirement from "../pages/kitchen/NewRequirement/NewRequirement.jsx";
import PreviousRequirement from "../pages/kitchen/PreviousRequirement/PreviousRequirement.jsx";
import TrackRequirement from "../pages/kitchen/TrackRequirement/TrackRequirement.jsx";
import RequirementDetails from "../pages/kitchen/RequirementDetails/RequirementDetails.jsx";
import MainStoreLayout from "../layouts/MainStoreLayout.jsx";
import Requirements from "../pages/MainStore/Requirements/Requirements.jsx";
import Inventory from "../pages/MainStore/Inventory/Inventory.jsx";
import Vehicles from "../pages/MainStore/Vehicles/Vehicles.jsx";
import Drivers from "../pages/MainStore/Drivers/Drivers.jsx";
import RequirementWorkspace from "../pages/MainStore/RequirementWorkspace/RequirementWorkspace.jsx";
import Kitchens from "../pages/MainStore/Kitchens/Kitchens.jsx";
import Users from "../pages/MainStore/Users/Users.jsx";
import Reports from "../pages/MainStore/Reports/Reports.jsx";
import PasswordResetForm from "../pages/auth/PasswordResetForm.jsx";
import Settings from "../pages/MainStore/Settings/Settings.jsx";
import KitchenSettings from "../pages/kitchen/Settings/Settings.jsx"
import VehicleTracking from "../pages/VehicleTracking/VehicleTracking.jsx"
import Pending from "../pages/MainStore/Pending/Pending.jsx";
import Downloads from "../pages/MainStore/Downloads/Downloads.jsx";
import Uploads from "../pages/kitchen/Uploads/Uploads.jsx";
import MaintenanceStore from "../pages/MainStore/maintenance/Maintenance.jsx";
import MaintenanceKitchen from "../pages/kitchen/maintenanceNew/Maintenance.jsx";

import NewAdminRequirement from "../pages/MainStore/NewRequirements/Requirements.jsx"

import TripLayout from "../layouts/TripLayout";

import Trip from "../pages/trip/Trip.jsx";
import CreateTrip from "../pages/trip/CreateTrip.jsx";
import ActiveTrip from "../pages/trip/ActiveTrip.jsx";
import TripHistory from "../pages/trip/TripHistory.jsx";
import TripDetails from "../pages/trip/TripDetails.jsx";
import Service from "../pages/MainStore/maintenance/Service.jsx";
import Visitor from "../pages/MainStore/maintenance/Visitor.jsx";
import Purchase from "../pages/MainStore/maintenance/Purchase.jsx";

import KitchenService from "../pages/kitchen/maintenanceNew/Service.jsx";
import KitchenVisitor from "../pages/kitchen/maintenanceNew/Visitor.jsx";
import KitchenPurchase from "../pages/kitchen/maintenanceNew/Purchase.jsx";

import Notification from "../pages/notifications/Notification.jsx";
import Submitted from "../pages/MainStore/NewRequirements/Submitted.jsx";
import Received from "../pages/MainStore/NewRequirements/Received.jsx";
import OutForDelivery from "../pages/MainStore/NewRequirements/OutForDelivery.jsx";


const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Language />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetpass" element={<PasswordResetForm />} />

<Route
    path="/new-requirement"
    element={
        <ProtectedRoute roles={["Kitchen Incharge","Store Incharge"]}>
            <NewRequirement />
        </ProtectedRoute>
    }
/>

<Route
    path="/history"
    element={
        <ProtectedRoute roles={["Kitchen Incharge","Store Incharge"]}>
            <PreviousRequirement />
        </ProtectedRoute>
    }
/>

<Route
    path="/track"
    element={
        <ProtectedRoute roles={["Kitchen Incharge","Store Incharge"]}>
            <TrackRequirement />
        </ProtectedRoute>
    }
/>
 <Route
        path="tracker"
        element={<VehicleTracking />}
    />

<Route
    path="/requirements/:id"
    element={
        <ProtectedRoute roles={["Kitchen Incharge" ,"Store Incharge"]}>
            <RequirementDetails />
        </ProtectedRoute>
    }
/>
<Route
    path="/uploads"
    element={
        <ProtectedRoute roles={["Kitchen Incharge" ,"Store Incharge"]}>
            <Uploads />
        </ProtectedRoute>
    }
/>
<Route
  path="/maintenance"
  element={
    <ProtectedRoute
      roles={["Kitchen Incharge", "Store Incharge"]}
    >
      <MaintenanceKitchen />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<Navigate to="service" replace />}
  />

  <Route
    path="service"
    element={<KitchenService />}
  />

  <Route
    path="visitor"
    element={<KitchenVisitor />}
  />

  <Route
    path="purchase"
    element={<KitchenPurchase />}
  />
</Route>

<Route
    path="/settings"
    element={
        <ProtectedRoute roles={["Kitchen Incharge","Store Incharge"]}>
            <KitchenSettings />
        </ProtectedRoute>
    }
/>
<Route 
path="/notifications"
element={<Notification />}
/>
{/* ||||||||||||MAIN STORE||||||||||||||||||||||||||||||||||||||||MAIN STORE|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}

      <Route
    path="/store"
    element={
        <ProtectedRoute
            roles={[
                "Admin",
                "Store Supervisor",
                "district coordinator",
                "Chief Coordinator",
            ]}
        >
            <MainStoreLayout />
        </ProtectedRoute>
    }
>

    <Route
        index
        element={<Navigate to="requirements" replace />}
    />

    {/* <Route
        path="requirements"
        element={<Requirements />}
    /> */}

    <Route
        path="requirements/:id"
        element={<RequirementWorkspace />}
    />

    <Route
        path="inventory"
        element={<Inventory />}
    />

    <Route
        path="vehicles"
        element={<Vehicles />}
    />
    <Route
        path="tracker"
        element={<VehicleTracking />}
    />

    <Route
        path="drivers"
        element={<Drivers />}
    />
    <Route
        path="kitchens"
        element={<Kitchens />}
    />
    <Route
        path="users"
        element={<Users />}
    />
   <Route
    path="reports"
    element={<Reports />}
    />
   <Route
    path="settings"
    element={<Settings />}
    />
   <Route
    path="pending"
    element={<Pending />}
    />
    
   <Route path="requirements" element={<NewAdminRequirement />}>
    <Route index element={<Navigate to="Submitted" replace />} />
    <Route path="submitted" element={<Submitted />}/>
     <Route path="Out For Delivery" element={<OutForDelivery />}/>
    <Route path="received" element={<Received />}/>
    </Route>

  <Route path="maintenance" element={<MaintenanceStore />}>
  <Route index element={<Navigate to="service" replace />} />
  <Route
    path="service"
    element={<Service />}
  />

  <Route
    path="visitor"
    element={<Visitor />}
  />

  <Route
    path="purchase"
    element={<Purchase />}
  />
</Route>

   <Route
    path="downloads"
    element={<Downloads />}
    />

</Route>

||||||||||||||||||||||TRIP|||||||||||||||||||||||||||||||||||||||||||||||||||||||

      <Route
    path="/trip"
    element={
        <ProtectedRoute
            roles={[
                "Driver"
            ]}
        >
            <TripLayout />
        </ProtectedRoute>
    }
>
    <Route path="/trip" element={<Trip />} />
    <Route path="/trip/:id" element={<TripDetails />}/>
    <Route path="/trip/create" element={<CreateTrip />} />
    <Route path="/trip/active" element={<ActiveTrip />} />
    <Route path="/trip/history" element={<TripHistory />} />

</Route>
    </Routes>

    
  );
};

export default AppRoutes;
