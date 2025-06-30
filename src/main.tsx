import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

import { Authenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// importing create API and styles for MapLibre
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-js-amplify/dist/public/amplify-map.css";

import maplibregl from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling

import { AmplifyGeofenceControl } from "maplibre-gl-js-amplify";

import { drawPoints } from "maplibre-gl-js-amplify";


Amplify.configure(outputs);

// setting up the map
async function initializeMap() {

  const el = document.createElement("div");
  el.setAttribute("id", "map");
  document.body.appendChild(el);

  const map = await createMap({
    container: 'map',
    center: [-122.3321, 47.6062], // Seattle coordinates
    zoom: 11
  });

  map.on('load', function () {
    drawPoints(
      'mySourceName', // Arbitrary source name
      [
        {
          coordinates: [-122.483696, 37.833818], // [Longitude, Latitude]
          title: 'Golden Gate Bridge',
          address: 'A suspension bridge spanning the Golden Gate'
        }
      ], // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
      map,
      {
        showCluster: true,
        unclusteredOptions: {
          showMarkerPopup: true
        },
        clusterOptions: {
          showCount: true
        }
      }
    );
  });

  map.setStyle('myAmplifyGeoEsriTopographicMap'); // map name received from getAvailableMaps()
  map.resize(); // forces the map to re-render

  map.addControl(createAmplifyGeocoder());

  // Instead of using useControl, add the control directly to your map
  map.addControl(new AmplifyGeofenceControl());

  
}

initializeMap();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
