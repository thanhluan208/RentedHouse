import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AppThemeProvider from "./Providers/AppTheme.provider.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <App />
    <ToastContainer />
  </AppThemeProvider>
);
