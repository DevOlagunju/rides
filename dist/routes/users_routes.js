"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _rides_controllers = require("../controllers/rides_controllers");

var _users_controller = require("../controllers/users_controller");

var _requests_controllers = require("../controllers/requests_controllers");

var _check = require("express-validator/check");

var _middleware = require("../middlewares/middleware.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var router = _express["default"].Router(); //endpoint to create a ride offer

router.post(
  "/rides",
  [
    (0, _check.check)(
      "phone_no",
      "must be a valid mobile number"
    ).isMobilePhone()
  ],
  _middleware.verifyToken,
  _rides_controllers.createRide
); //endpoint to get all users

router.get("/", _middleware.verifyToken, _users_controller.getAllUser); //endpoint to get a ride details

router.get(
  "/:id/rides/:rideId",
  _middleware.verifyToken,
  _rides_controllers.getRide
); //endpoint to get all ride offers

router.get(
  "/:id/rides",
  _middleware.verifyToken,
  _rides_controllers.getAllRideTwo
); //endpoint to change status of request only accessible by admin

router.put(
  "/rides/:rideId/requests/:requestId",
  _middleware.verifyToken,
  _requests_controllers.acceptOrRejectRequest
);
var _default = router;
exports["default"] = _default;
