import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/shared/ProtectedRoute";

import Language from "../pages/Language/Language.jsx";
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


const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Language />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* <Route
    path="/dashboard"
    element={
        <ProtectedRoute roles={["Kitchen Incharge"]}>
            <Dashboard />
        </ProtectedRoute>
    }
/> */}

<Route
    path="/new-requirement"
    element={
        <ProtectedRoute roles={["Kitchen Incharge"]}>
            <NewRequirement />
        </ProtectedRoute>
    }
/>

<Route
    path="/history"
    element={
        <ProtectedRoute roles={["Kitchen Incharge"]}>
            <PreviousRequirement />
        </ProtectedRoute>
    }
/>

<Route
    path="/track"
    element={
        <ProtectedRoute roles={["Kitchen Incharge"]}>
            <TrackRequirement />
        </ProtectedRoute>
    }
/>

<Route
    path="/requirements/:id"
    element={
        <ProtectedRoute roles={["Kitchen Incharge"]}>
            <RequirementDetails />
        </ProtectedRoute>
    }
/>

{/* ||||||||||||MAIN STORE||||||||||||||||||||||||||||||||||||||||MAIN STORE|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}

      <Route
    path="/store"
    element={
        <ProtectedRoute
            roles={[
                "Admin",
                "Store Supervisor",
                "Store Incharge"
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

    <Route
        path="requirements"
        element={<Requirements />}
    />

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

</Route>
    </Routes>
  );
};

export default AppRoutes;
