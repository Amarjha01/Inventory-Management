import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Toast from "./utils/Toast";
import { requestAppPermissions } from "./services/permissions.js";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    requestAppPermissions().catch((error) => {
      console.error("Permission request failed:", error);
    });
  }, []);
  return (
    <BrowserRouter>
      <Toast />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
