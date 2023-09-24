const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const events = [];

app.post("/events", (req, res) => {
  try {
    const event = req.body;
    console.log("Event Received:", event.type);
    events.push(event);

    axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
      console.log(err.message);
    });
    axios.post("http://comments-srv:4001/events", event).catch((err) => {
      console.log(err.message);
    });
    axios.post("http://query-srv:4002/events", event).catch((err) => {
      console.log(err.message);
    });
    axios.post("http://moderation-srv:4003/events", event).catch((err) => {
      console.log(err.message);
    });

    res.send({ status: "OK" });
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event Bus Listening on Port 4005");
});
