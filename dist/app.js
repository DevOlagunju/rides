"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _check = require("express-validator/check");

var _routes = _interopRequireDefault(require("./routes"));

var _pg = require("pg");

var _users_controller = require("./controllers/users_controller");

var _middleware = require("./middlewares/middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
var PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(_express["default"]["static"](__dirname + "/front"));
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
var client = new _pg.Client({
  connectionString: process.env.DATABASE_URL
});
global.client = client;
client.connect().then(function () {
  console.log("database connected!");
  client.query("CREATE TABLE IF NOT EXISTS users(\n          id serial PRIMARY KEY,\n          first_name VARCHAR NOT NULL,\n          last_name VARCHAR NOT NULL,\n          email VARCHAR UNIQUE NOT NULL,\n          phone_no VARCHAR NOT NULL,\n          password VARCHAR NOT NULL,\n          role VARCHAR DEFAULT 'member'\n         )", function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("users table created");
      client.query("CREATE TABLE IF NOT EXISTS rides(\n              rideId serial PRIMARY KEY,\n              user_id INTEGER REFERENCES users(id),\n              car_name VARCHAR NOT NULL,\n              available_seats INT NOT NULL,\n              location VARCHAR NOT NULL,\n              phone_no VARCHAR NOT NULL,\n              time TIME NOT NULL,\n              destination VARCHAR NOT NULL\n             )", function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("rides table created successfully");
          client.query("CREATE TABLE IF NOT EXISTS requests(\n             requestId serial PRIMARY KEY,\n             ride_id INTEGER REFERENCES rides(rideId),\n             user_id INTEGER REFERENCES users(id),\n             passenger_name VARCHAR NOT NULL, \n             phone_no VARCHAR NOT NULL,\n             status VARCHAR DEFAULT 'pending'\n             )", function (err, res) {
            if (err) {
              console.log(err);
            } else {
              console.log("requests table created successfully");
            }
          });
        }
      });
    }
  });
})["catch"](function (err) {
  console.log("error connecting to Database", err);
});
(0, _routes["default"])(app);
app.post('/auth/signup', [(0, _check.check)('first_name').isAlpha().withMessage('must be alphabets only').isLength({
  min: 3,
  max: 20
}).withMessage('must be of 3 characters and above'), (0, _check.check)('email', 'must be a valid email').isEmail(), (0, _check.check)('phone_no', 'must be a valid mobile number').isMobilePhone(), (0, _check.check)('password').isLength({
  min: 5
}).withMessage('minimum length of 5')], _users_controller.createUser); //endpoint to login already created user account

app.post('/auth/signin', _users_controller.userLogin); //endpoint to get a user details

app.get('/me', _middleware.verifyToken, _users_controller.getUser);
app.listen(PORT, function () {
  console.log("server statrted at https://localhost:".concat(PORT));
});
var _default = app;
exports["default"] = _default;