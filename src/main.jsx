import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext"; 
import "./index.css";
import { AuthProvider } from "./context/auth";   

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
