const { events } = require("../db/events.db");
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

const allTravels = async (req, res, next) => {

    const body = req.body;
    const { start_location,
            end_location,
            start_time,
            end_time,
            vehicle,
            _id } = body;
    const user_id = req.user._id;

    const query = Object.assign({},
        vehicle && {vehicle},
        start_location && {start_location},
        end_location && {end_location},
        start_time && {start_time},
        end_time && {end_time},
        _id && {_id}
    );

    query.owner_id = new ObjectID(user_id);
    query.type = "travel";
    
    try {
        
        const db_result = await events.find(query);

        if(!db_result){
            error = new Error("Error finding travel events");
            next(error);
            return;
        }

        res.status(200).json(db_result);

    } catch (err) {
        error = new Error(err);
        next(error);
    }

}

const startTravel = async (req, res, next) => {

    const body = req.body;
    const { location, time, vehicle } = body;
    const user_id = req.user._id;

    if(!location || !time || !vehicle) {
        res.status(400).json({
            error: true,
            message: "Location, time and vehicle needs to be provided"
        })
        return;
    }

    try {

        const db_result = await events.insert({
            owner_id: new ObjectID(user_id),
            type: "travel",
            start_location: location,
            end_location: "----",
            start_time: time,
            end_time: "----",
            vehicle,
            created_at: new Date(Date.now()).toUTCString(),
            last_updated: new Date(Date.now()).toUTCString()
        })

        if(!db_result) {
            error = new Error("Could not update travel event");
            next(error);
            return;
        }

        res.status(200).json(db_result);

    } catch (err) {
        error = new Error(err);
        next(error);
    }

}

const endTravel = async (req, res, next) => {

    const body = req.body;
    const { location, time, travel_id } = body;
    const user_id = req.user._id;

    if(!location || !time || !travel_id) {
        res.status(400).json({
            error: true,
            message: "Travel_id, location and time needs to be provided"
        })
        return;
    }

    try {
        
        const db_result = await events.findOneAndUpdate(
            {
                owner_id: new ObjectID(user_id),
                _id: new ObjectID(travel_id)
            },
            {$set: {
                end_location: location,
                end_time: time,
                last_updated: new Date(Date.now()).toUTCString()
            }},
            {
                returnOriginal: false
            }
        )

        if(!db_result) {
            error = new Error("Could not update travel event");
            next(error);
            return;
        }

        res.status(200).json(db_result);

    } catch (err) {
        error = new Error(err);
        next(error);
    }


}

const ongoingTravel = async (req, res, next) => {

    const user_id = req.user._id;

    try {
        const db_result = await events.findOne({
            owner_id: new ObjectID(user_id),
            end_time: "----"
        })

        if(!db_result) {
            error = new Error("Could not find travel event");
            next(error);
            return;
        }

        res.status(200).json(db_result);

    } catch(err) {
        error = new Error(err);
        next(error);
    }

}

module.exports = {
    allTravels,
    startTravel,
    endTravel,
    ongoingTravel
}