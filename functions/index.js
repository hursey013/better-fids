// Init Firebase
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Init Realtime Database
const db = admin.database();
const ref = db.ref("locations");

// Init Express
const express = require("express");
const cors = require("cors")({ origin: "http://warhammer.mcc.virginia.edu" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// Init Google Maps API
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getGeocoding = async address => {
  // Send address to Gelocation API
  const response = await client.geocode({
    params: {
      address: `${address} Charlottesville, VA`,
      components: "country:US",
      key: functions.config().google.key
    }
  });

  functions.logger.info(JSON.stringify(response.data.results[0], null, 2));

  return response.data.results[0];
};

const saveLocation = async incident => {
  const { 3: address } = incident;

  // Check if address is a lat/lng
  if (address.includes("~")) {
    const coords = address.split("~");
    const [lat, lng] = coords;

    return { lat, lng, ...incident };
  }

  const snapshot = await ref
    .orderByChild("original_address")
    .equalTo(address)
    .once("value");

  let data;

  // See if original address already exists in DB
  if (snapshot.exists()) {
    data = Object.values(snapshot.val())[0];
  } else {
    data = await getGeocoding(address);

    // Save geocoding data to DB for future use
    ref.push({ ...data, original_address: address });
  }

  return {
    lat: data.geometry.location.lat,
    lng: data.geometry.location.lng,
    ...incident
  };
};

app.post("/api", async (req, res) => {
  try {
    const data = await Promise.all(req.body.incidents.map(saveLocation));

    res.set("Cache-Control", "public, max-age=30, s-maxage=60");
    return res.status(200).send(data);
  } catch (err) {
    functions.logger.error(err);

    return res.status(500);
  }
});

exports.app = functions.https.onRequest(app);
