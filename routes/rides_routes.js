const  express = require("express");
//import bodyParser from "body-parser";
const {
  createRequest,
  getAllRequest,
  getUserRideRequests
} = require("../controllers/requests_controllers");
const {
  getAllRide,
  getAvailableRides,
  changeDestination,
  deletes
} = require("../controllers/rides_controllers");

const { check } = require("express-validator/check");
const { verifyToken }= require("../middlewares/middleware");

var router = express.Router();

//endpoint to get all ride offers
router.get("/", verifyToken, getAllRide);

// //endpoint to get specific user ride request
router.get("/:id", verifyToken, getAvailableRides);

//endpoint to create a request for a rideoffer
router.post(
  "/requests",
  [check("phone_no", "must be a valid mobile number").isMobilePhone()],
  verifyToken,
  createRequest
);

// //endpoint to get edit user ride request
//router.put("/edit/:id", verifyToken, changeDestination);

// //endpoint to get edit user ride request
router.post("/edit/:id", verifyToken, changeDestination);
// //endpoint to delete user ride request
router.get("/delete/:id", verifyToken, deletes);

//endpoint to get a specific request details
// router.get('/users/rides/:rideId/requests', verifyToken, getRequest);

//endpoint to get all requests
router.get("/requests", verifyToken, getAllRequest);

//endpoint to get specific user ride request
router.get("/requests/:id", verifyToken, getUserRideRequests);

module.exports = router;
