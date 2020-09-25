import React from "react";
import { Map, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-control";

function IncidentMap(props) {
  return (
    <Map center={[38.03, -78.478889]} zoom={13} zoomControl={false}>
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <Control position="topright"></Control>
      {props.incidents.map(incident => (
        <Marker key={incident.Incident} position={[incident.lat, incident.lng]}>
          <Popup>
            <div>
              <h2>{incident.CallType}</h2>
              <p>
                {incident.Location}
                <br />
                {incident.Date} @ {incident.CallReceived}
              </p>
              <p>
                <strong>Incident #</strong>
                <br />
                {incident.Incident}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </Map>
  );
}

export default IncidentMap;
