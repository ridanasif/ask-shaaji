import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AlertProvider } from "./context/AlertContext";

createRoot(document.getElementById("root")).render(
  <AlertProvider>
    <App />
  </AlertProvider>
);
