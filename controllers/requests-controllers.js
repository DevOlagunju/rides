
import { validationResult } from "express-validator/check";




export const createRequest = (req, res) => {
    console.log('initial state', req.body)
    const { ride_id, passenger_name, pickup_location, phone_no, time, destination } = req.body
    const errors = validationResult(req);
    console.log(">>>", req.body)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        client.query('INSERT INTO requests (ride_id, passenger_name, pickup_location, phone_no, time, destination) VALUES ($1, $2, $3, $4, $5, $6)RETURNING *',
            [ride_id, passenger_name, pickup_location, phone_no, time, destination], (error, request) => {
                if (error) {
                    res.send(error);
                    console.log(">>>", error)
                } else {
                    return res.status(201).send({
                        success: true,
                        msg: "request created successfully",
                        requestId: request.rows[0].id
                    })
                }
            });
    }
}

export const getAllRequest = (req, res) => {
    const rideId = parseInt(req.params.rideId)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        client.query(
            `SELECT * FROM requests where ride_id = ${rideId}`,
            (err, requests) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(requests.rows);
                }
            }
        );
    }
};


export const acceptOrRejectRequest = (req, res) => {
    const requestId = parseInt(req.params.requestId)
    const rideId = parseInt(req.params.rideId)
    const { status } = req.body

        client.query(`UPDATE requests SET status = $1 WHERE requestId = ${requestId} AND ride_id = ${rideId}`, [status], (err, request) => {
            if (err) {
                res.send(err);
                console.log(err)
            } else {
                res.send({
                    success: true,
                    msg: "updated status successfully",
                    details: request.rows[0]
                });
            }
        })
    }














