const {
  validationResult
} = require("express-validator/check");

exports.createRide = (req, res) => {
  const {
    user_id,
    car_name,
    available_Seats,
    location,
    phone_no,
    time,
    destination
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query(
      "INSERT INTO rides (user_id, car_name, available_seats, location, phone_no, time, destination) VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *",
      [
        user_id,
        car_name,
        available_Seats,
        location,
        phone_no,
        time,
        destination
      ],
      (error, ride) => {
        if (error) {
          res.send(error);
        } else {
          res.send({
            success: true,
            msg: "rideoffer created successfully",
            rideId: ride.rows[0].rideid
          });
        }
      }
    );
  } else {
    res
      .status(401)
      .send({
        msg: "Sorry you can not create ride for another User!"
      });
  }
};

exports.getRide = (req, res) => {
  const userId = parseInt(req.params.id);
  const rideId = parseInt(req.params.rideId);
  console.log("=========>", req);
  const errors = validationResult(req);
  if (!errors.isempty()) {
    res.status(422).json({
      errors: errors.array()
    });
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

exports.getAllRideTwo = (req, res) => {
  const userId = parseInt(req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
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

exports.getAllRide = (req, res) => {
  //const userId = parseInt(req.params.id)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query(`SELECT * FROM rides`, (err, rides) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rides.rows);
      }
    });
  }
};

exports.getAvailableRides = (req, res) => {
  const userId = parseInt(req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query(
      `SELECT * FROM rides WHERE user_id != ${userId}`,
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

exports.changeDestination = (req, res) => {
  //console.log("yoga");
  //console.log(req.params.rideId)

  console.log(req.body);
  const {
    rideId,
    destination,
    user_id
  } = req.body;

  console.log(`${destination} ${userId} ${user_id}`);

  if (req.decoded.id === parseInt(user_id, 10)) {
    client.query(
      "UPDATE rides SET destination = $1 WHERE rideId = $2 AND user_id = $3 RETURNING *",
      [destination, rideId, user_id],
      (err, results) => {
        if (err) {
          res.send(err);
        } else if (!results.rows[0]) {
          res.send({
            msg: "you can not change Destination for another User!"
          });
        } else {
          res.send({
            msg: "Destination changed successfully",
            details: results.rows[0]
          });
        }
      }
    );
  } else {
    res.send({msg:"Sorry! You can't change the destination for another user's ride"});
  }
};

exports.deletes = (req, res) => {
  const rideId = parseInt(req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query(`DELETE FROM rides WHERE rideId = ${rideId}`, (err, rides) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(" ride deleted successfully");
      }
    });
  }
};