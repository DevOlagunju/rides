const express = require('express');
//import bodyParser from 'body-parser';
const {
  createRide,
  getAllRideTwo,
  getRide
} = require('../controllers/rides_controllers');
const {
  getAllUser
} = require('../controllers/users_controller');
const {
  acceptOrRejectRequest
} = require('../controllers/requests_controllers');

const {
  check
} = require('express-validator/check');
const {
  verifyToken
} = require('../middlewares/middleware.js');
var router = express.Router()


//endpoint to create a ride offer
router.post("/rides",
  [check('phone_no', 'must be a valid mobile number').isMobilePhone()],
  verifyToken, createRide);

//endpoint to get all usersl   
router.get('/', verifyToken, getAllUser);

//endpoint to get a ride details
router.get("/:id/rides/:rideId", verifyToken, getRide);


//endpoint to get all ride offers
router.get("/:id/rides", verifyToken, getAllRideTwo);

//endpoint to change status of request only accessible by admin
router.put('/rides/:rideId/requests/:requestId', verifyToken, acceptOrRejectRequest)


module.exports = router;