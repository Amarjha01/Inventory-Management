import { createRoot } from 'react-dom/client'
import { registerSW } from "virtual:pwa-register";
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'

registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },

  onOfflineReady() {
    console.log("App ready to work offline");
  },
});
createRoot(document.getElementById('root')).render(
  
    <App />
)
