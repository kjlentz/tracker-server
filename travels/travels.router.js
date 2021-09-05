const express = require('express');

const router = express.Router();

const { allTravels, startTravel, endTravel } = require("./travels.controller");

router.get(
    "/",
    allTravels
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