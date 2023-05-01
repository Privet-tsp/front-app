import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthContextProvider, ReportContextProvider } from "./contexts";
import axios from "axios";
import "./index.css";

axios.defaults.baseURL = "http://localhost:4444";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ReportContextProvider>
          <App />
        </ReportContextProvider>
        <Toaster />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
