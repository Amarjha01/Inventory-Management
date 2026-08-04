import { Routes, Route, Navigate } from "react-router-dom";

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


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Language />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/new-requirement" element={<NewRequirement />} />
      <Route
        path="/history"
        element={<PreviousRequirement />}
      />
      <Route path="/track" element={<TrackRequirement />} />
      <Route path="/requirements/:id" element={<RequirementDetails />} />



      <Route path="/store" element={<MainStoreLayout />}>

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

</Route>
    </Routes>
  );
};

export default AppRoutes;
