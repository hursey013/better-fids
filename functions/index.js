// Init Firebase
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Init Realtime Database
const db = admin.database();
const ref = db.ref("locations");

// Init Express
const express = require("express");
const app = express();
const router = express.Router();

// Init Axios
const axios = require("axios").default;

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
  const { Location: address } = incident;

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

router.get("/incidents", async (req, res) => {
  try {
    const response = await axios.get(functions.config().apify.endpoint, {
      params: {
        token: functions.config().apify.token,
        clean: true
      }
    });
    const data = await Promise.all(response.data.map(saveLocation));

    res.set("Cache-Control", "public, max-age=300, s-maxage=600");

    return res.status(200).send(data);
  } catch (err) {
    functions.logger.error(err);

    return res.status(500);
  }
});

app.use("/api", router);

exports.api = functions.https.onRequest(app);
