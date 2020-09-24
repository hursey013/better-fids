// Init Firebase
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Init Realtime Database
const db = admin.database();
const ref = db.ref("location");

// Init Express
const express = require("express");
const app = express();
const router = express.Router();

// Init Axios
const axios = require("axios").default;

// Init Google Maps API
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

const getLatLong = async address => {
  // Send address to Gelocation API, get lat/lng back
  const response = await client.geocode({
    params: {
      address: `${address} Charlottesville, VA`,
      components: "country:US",
      key: functions.config().google.key
    }
  });

  return {
    lat: response.data.results[0].geometry.location.lat,
    lng: response.data.results[0].geometry.location.lng
  };
};

const saveLatLngToDb = async incident => {
  const { Location: address } = incident;

  // Check if the address is already a lat/lng
  if (address.includes("~")) {
    const coords = address.split("~");
    const [lat, lng] = coords;

    return { lat, lng, ...incident };
  }

  // See if address coordinates exist in DB
  const snapshot = await ref
    .orderByChild("address")
    .equalTo(address)
    .once("value");

  if (snapshot.exists()) {
    const { lat, lng } = Object.values(snapshot.val())[0];

    return {
      lat,
      lng,
      ...incident
    };
  }

  const latLng = await getLatLong(address);

  // Save lat/lng to DB for future use
  ref.push({ ...latLng, address });

  return { ...latLng, ...incident };
};

router.get("/incidents", async (req, res) => {
  try {
    const response = await axios.get(functions.config().apify.endpoint, {
      params: {
        token: functions.config().apify.token,
        clean: true
      }
    });
    const data = await Promise.all(response.data.map(saveLatLngToDb));

    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).send(data);
  } catch (err) {
    functions.logger.error(err);

    return res.status(500);
  }
});

app.use("/api", router);

exports.api = functions.https.onRequest(app);
