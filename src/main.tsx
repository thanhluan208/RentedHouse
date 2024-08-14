import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AppThemeProvider from "./Providers/AppTheme.provider.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "pdfmake/build/vfs_fonts";
import AuthenticationProvider from "./Providers/AuthenticationProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <AuthenticationProvider>
      <App />
      <ToastContainer />
    </AuthenticationProvider>
  </AppThemeProvider>
);
