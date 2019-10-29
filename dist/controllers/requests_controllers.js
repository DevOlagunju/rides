"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acceptOrRejectRequest = exports.getAllRequest = exports.createRequest = void 0;

var _check = require("express-validator/check");

var createRequest = function createRequest(req, res) {
  var userId = req.decoded.userId;
  var _req$body = req.body,
    rideId = _req$body.rideId,
    passenger_name = _req$body.passenger_name,
    phone_no = _req$body.phone_no;
  client.query(
    "SELECT rideId,user_id,available_seats FROM rides WHERE rideId=".concat(
      rideId
    ),
    function(err, resp) {
      var seats;

      if (err) {
        res.status(500).send({
          code: 500,
          message: "Could not get the ride you are requesting to join."
        });
      }

      if (resp.rows.length) {
        if (resp.rows[0].available_seats === 0) {
          res.status(409).jsend.fail({
            code: 409,
            message: "This ride is all booked. No more seats available"
          });
        } else {
          seats = resp.rows[0].available_seats - 1;
          client.query(
            "INSERT INTO requests ( ride_Id,usersId,passenger_name,phone_no,) VALUES (\n                 '"
              .concat(rideId, "','")
              .concat(userId, "','")
              .concat(passenger_name, "','")
              .concat(phone_no, "')"),
            function(error, response) {
              if (error) {
                res.status(409).jsend.fail({
                  code: 409,
                  messsage: "You cannot join the same ride twice."
                });
              }

              if (response) {
                client.query(
                  "UPDATE rides SET available_seats="
                    .concat(seats, " WHERE rideId=")
                    .concat(rideId),
                  function(anyError) {
                    if (anyError) {
                      res.status(500).jsend.error({
                        code: 500,
                        message:
                          "An error occured completing your request. Please try again."
                      });
                    } else {
                      res.status(201).jsend.success({
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
        res.status(404).jsend.fail({
          message: "The ride you requested for does not exist",
          code: 404
        });
      }
    }
  );
}; // export const createRequest = (req, res) => {
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

exports.createRequest = createRequest;

var getAllRequest = function getAllRequest(req, res) {
  var rideId = parseInt(req.params.rideId);
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query(
      "SELECT * FROM requests where ride_id = ".concat(rideId),
      function(err, requests) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(requests.rows);
        }
      }
    );
  }
};

exports.getAllRequest = getAllRequest;

var acceptOrRejectRequest = function acceptOrRejectRequest(req, res) {
  var requestId = parseInt(req.params.requestId);
  var rideId = parseInt(req.params.rideId);
  var status = req.body.status;
  client.query(
    "UPDATE requests SET status = $1 WHERE requestId = "
      .concat(requestId, " AND ride_id = ")
      .concat(rideId),
    [status],
    function(err, request) {
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

exports.acceptOrRejectRequest = acceptOrRejectRequest;
