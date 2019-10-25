"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _requests_controllers = require("../controllers/requests_controllers");

var _rides_controllers = require("../controllers/rides_controllers");

var _check = require("express-validator/check");

var _middleware = require("../middlewares/middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); //endpoint to get all ride offers


router.get("/", _middleware.verifyToken, _rides_controllers.getAllRide); //endpoint to create a request for a rideoffer

router.post('/requests', [(0, _check.check)('phone_no', 'must be a valid mobile number').isMobilePhone()], _middleware.verifyToken, _requests_controllers.createRequest); //endpoint to get a specific request details
// router.get('/users/rides/:rideId/requests', verifyToken, getRequest);
//endpoint to get all requests

router.get('/:rideId/requests', _middleware.verifyToken, _requests_controllers.getAllRequest);
var _default = router;
exports["default"] = _default;