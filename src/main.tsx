import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import { MapView } from "@aws-amplify/ui-react-geo";
import "@aws-amplify/ui-react-geo/styles.css";
import outputs from "../amplify_outputs.json";

function InitialViewport() {
  return (
    <MapView 
      initialViewState={{
        latitude: 37.7749, // Example latitude
        longitude: -122.4194, // Example longitude
        zoom: 10, // Initial zoom level
      }}
    />
  );
}

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <InitialViewport />
  </React.StrictMode>
);
