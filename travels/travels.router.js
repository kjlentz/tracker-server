const express = require('express');

const router = express.Router();

const { allTravels, startTravel, endTravel, ongoingTravel } = require("./travels.controller");

router.get(
    "/",
    allTravels
)

router.get(
    "/ongoing",
    ongoingTravel
)

router.post(
    "/",
    startTravel
);

router.put(
    "/",
    endTravel
)

module.exports = router;