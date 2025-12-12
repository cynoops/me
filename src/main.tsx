import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing");
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        const requestUpdate = () => registration.update();

        const activateWaitingWorker = (worker: ServiceWorker | null) => {
          if (worker) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        };

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              activateWaitingWorker(registration.waiting);
            }
          });
        });

        if (registration.waiting) {
          activateWaitingWorker(registration.waiting);
        }

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });

        requestUpdate();
        const updateInterval = window.setInterval(
          requestUpdate,
          UPDATE_CHECK_INTERVAL,
        );

        window.addEventListener("beforeunload", () => {
          window.clearInterval(updateInterval);
        });
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
