import { validationResult } from "express-validator/check";

export const createRequest = (req, res) => {
  // const { user_id } = req.decoded;
  const { user_id, ride_id, passenger_name, phone_no } = req.body;

  client.query(
    `SELECT rideid,user_id,available_seats FROM rides WHERE rideid=${ride_id}`,
    (err, resp) => {
      let seats;
      if (err) {
        res.status(500).send({
          code: 500,
          message: "Could not get the ride you are requesting to join."
        });
      }

      if (resp.rows.length) {
        if (resp.rows[0].available_seats === 0) {
          res.status(409).send({
            code: 409,
            message: "This ride is all booked. No more seats available"
          });
        } else {
          seats = resp.rows[0].available_seats - 1;
          client.query(
            `INSERT INTO requests (ride_id,user_id,passenger_name,phone_no) VALUES (
                 '${ride_id}','${user_id}','${passenger_name}','${phone_no}')`,
            (error, response) => {
              if (error) {
                res.status(409).send({
                  code: 409,
                  messsage: "You cannot join the same ride twice."
                });
              }
              if (response) {
                client.query(
                  `UPDATE rides SET available_seats=${seats} WHERE rideid=${ride_id}`,
                  anyError => {
                    if (anyError) {
                      res.status(500).send({
                        code: 500,
                        message:
                          "An error occured completing your request. Please try again."
                      });
                    } else {
                      res.status(201).send({
                        message:
                          "Your request to join the ride has been completed"
                      });
                    }
                  }
                );
              }
            }
          );
        }
      } else {
        res.status(404).send({
          message: "The ride you requested for does not exist",
          code: 404
        });
      }
    }
  );
};

// export const createRequest = (req, res) => {
//     //console.log('initial state', req.body)
//     const { ride_id, passenger_name, phone_no } = req.body
//     const errors = validationResult(req);
//     //console.log(">>>", req.body)
//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     } else {
//         const available_seats = client.query('select available_seats from rides  where rideid=1', (error, request) => {
//             if (error) {

//                 console.log("--->>>", error);
//             }
//         })
//         const newSeats = available_seats;
//         client.query(`UPDATE rides SET (available_seats) = ${newSeats}, SELECT(available_seats) FROM rides WHERE rideid=1`,  (error, request) => {
//             if (error) {

//                 console.log(">>>", error);
//             }

//         })
//         client.query('INSERT INTO requests (ride_id, passenger_name,phone_no) VALUES ($1, $2, $3)RETURNING *',
//             [ride_id, passenger_name, phone_no], (error, request) => {
//                 if (error) {
//                     res.send(error);
//                     console.log(">>>", error)
//                 } else {
//                     return res.status(201).send({
//                         success: true,
//                         msg: "request created successfully",
//                         requestId: request.rows[0].requestid
//                     })
//                 }
//             });
//     }
// }

export const getAllRequest = (req, res) => {
  const rideId = parseInt(req.params.rideId);
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

export const getUserRideRequests = (req, res) => {
  const user_id = parseInt(req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    client.query(
      `SELECT * FROM requests where ride_id IN (SELECT rideid FROM rides WHERE user_id= ${user_id})`,
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
  const requestId = parseInt(req.params.requestId);
  const rideId = parseInt(req.params.rideId);
  const { status } = req.body;

  client.query(
    `UPDATE requests SET status = $1 WHERE requestId = ${requestId} AND ride_id = ${rideId}`,
    [status],
    (err, request) => {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        res.send({
          success: true,
          msg: "updated status successfully",
          details: request.rows[0]
        });
      }
    }
  );
};
