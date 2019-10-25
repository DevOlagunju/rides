"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllRide = exports.getAllRideTwo = exports.getRide = exports.createRide = void 0;

var _check = require("express-validator/check");

var createRide = function createRide(req, res) {
  var _req$body = req.body,
      user_id = _req$body.user_id,
      car_name = _req$body.car_name,
      available_Seats = _req$body.available_Seats,
      location = _req$body.location,
      phone_no = _req$body.phone_no,
      time = _req$body.time,
      destination = _req$body.destination;
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query('INSERT INTO rides (user_id, car_name, available_seats, location, phone_no, time, destination) VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *', [user_id, car_name, available_Seats, location, phone_no, time, destination], function (error, ride) {
      if (error) {
        res.send(error);
      } else {
        res.send({
          success: true,
          msg: "rideoffer created successfully",
          rideId: ride.rows[0].rideid
        });
      }
    });
  } else {
    res.status(401).send({
      msg: 'Sorry you can not create ride for another User!'
    });
  }
};

exports.createRide = createRide;

var getRide = function getRide(req, res) {
  var userId = parseInt(req.params.id);
  var rideId = parseInt(req.params.rideId);
  console.log("=========>", req);
  var errors = (0, _check.validationResult)(req);

  if (!errors.isempty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query("SELECT * FROM rides WHERE rideId = ".concat(rideId, " and user_id = ").concat(userId), function (err, ride) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(ride.rows[0]);
      }
    });
  }
};

exports.getRide = getRide;

var getAllRideTwo = function getAllRideTwo(req, res) {
  var userId = parseInt(req.params.id);
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query("SELECT * FROM rides WHERE user_id = ".concat(userId), function (err, rides) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rides.rows);
      }
    });
  }
};

exports.getAllRideTwo = getAllRideTwo;

var getAllRide = function getAllRide(req, res) {
  //const userId = parseInt(req.params.id)
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query("SELECT * FROM rides", function (err, rides) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rides.rows);
      }
    });
  }
};

exports.getAllRide = getAllRide;