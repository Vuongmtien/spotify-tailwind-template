import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";
import { AuthProvider } from "./context/auth";

function waitForSpotifySDK() {
  return new Promise((resolve) => {
    if (window.Spotify) resolve();
    else {
      const check = setInterval(() => {
        if (window.Spotify) {
          clearInterval(check);
          resolve();
        }
      }, 300);
    }
  });
}

waitForSpotifySDK().then(() => {
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
});
