import React from "react";
import { Map, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-control";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "./IncidentMap.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

function IncidentMap(props) {
  return (
    <Map center={[38.03, -78.478889]} zoom={13} zoomControl={false}>
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <Control position="topright"></Control>
      {props.incidents.map(
        ({ 0: date, 1: id, 3: location, 4: type, 5: time, lat, lng }) => (
          <Marker key={id} position={[lat, lng]}>
            <Popup>
              <div>
                <h2>{type}</h2>
                <p>
                  {location}
                  <br />
                  {date} @ {time}
                </p>
                <p>
                  <strong>Incident #</strong>
                  <br />
                  {id}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      )}
    </Map>
  );
}

export default IncidentMap;
