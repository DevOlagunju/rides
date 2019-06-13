

import { validationResult } from "express-validator/check";



export const createRide = (req, res) => {


    const { user_id, car_name, available_Seats, location, phone_no, time, destination } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        client.query('INSERT INTO rides (user_id, car_name, available_seats, location, phone_no, time, destination) VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *',
            [user_id, car_name, available_Seats, location, phone_no, time, destination], (error, ride) => {
                if (error) {
                    throw error
                } else {
                    res.status(201).send({
                        success: true,
                        msg: "rideoffer added successfully",
                        rideId: ride.rows[0].rideId,
                    })
                }
            });
    }
}


export const getRide = (req, res) => {
    const userId = parseInt(req.params.id)
    const rideId = parseInt(req.params.rideId)
    console.log("=========>", req)
    //const errors = validationResult(req);
    if (false) {
        res.status(422).json({ errors: errors.array() });
    } else {
        client.query(
            `SELECT * FROM rides WHERE rideId = ${rideId} and user_id = ${userId}`,
            (err, ride) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(ride.rows[0]);
                }
            }
        );
    }
};


export const getAllRide = (req, res) => {
    const userId = parseInt(req.params.id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        client.query(
            `SELECT * FROM rides WHERE user_id = ${userId}`,
            (err, rides) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(rides.rows);
                }
            }
        );
    }
};


