import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onRegistered(r) {
    if (r) {
      console.log("Service worker registered.");
      r.onUpdate = () => {
        console.log("New content is available, please refresh.");
      };
    }
  },
  onError(error) {
    console.error("SW registration error", error);
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
