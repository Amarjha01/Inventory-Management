import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Toast from "./utils/Toast";

function App() {
    return (
        <BrowserRouter>
         <Toast />
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;