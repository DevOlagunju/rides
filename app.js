const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const {
  check
} = require("express-validator/check");
const routes = require("./routes");
const {
  Client
} = require("pg");
const {
  createUser,
  userLogin,
  getUser
} = require("./controllers/users_controller");
const {
  verifyToken
} = require("./middlewares/middleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 7000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.static(__dirname + "/front"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

global.client = client;

client
  .connect()
  .then(() => {
    console.log("database connected!");
    client.query(
      `CREATE TABLE IF NOT EXISTS users(
          id serial PRIMARY KEY,
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          email VARCHAR UNIQUE NOT NULL,
          phone_no VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          role VARCHAR DEFAULT 'member'
         )`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("users table created");
          client.query(
            `CREATE TABLE IF NOT EXISTS rides(
              rideId serial PRIMARY KEY,
              user_id INTEGER REFERENCES users(id),
              car_name VARCHAR NOT NULL,
              available_seats INT NOT NULL,
              location VARCHAR NOT NULL,
              phone_no VARCHAR NOT NULL,
              time TIME NOT NULL,
              destination VARCHAR NOT NULL
             )`,
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log("rides table created successfully");
                client.query(
                  `CREATE TABLE IF NOT EXISTS requests(
             requestId serial PRIMARY KEY,
             ride_id INTEGER REFERENCES rides(rideId),
             user_id INTEGER REFERENCES users(id),
             passenger_name VARCHAR NOT NULL, 
             phone_no VARCHAR NOT NULL,
             status INTEGER DEFAULT 1
             )`,
                  (err, res) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("requests table created successfully");
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  })
  .catch(err => {
    console.log("error connecting to Database", err);
  });

routes(app);

app.post(
  "/auth/signup",
  [
    check("first_name")
    .isAlpha()
    .withMessage("must be alphabets only")
    .isLength({
      min: 3,
      max: 20
    })
    .withMessage("must be of 3 characters and above"),
    check("email", "must be a valid email").isEmail(),
    check("phone_no", "must be a valid mobile number").isMobilePhone(),
    check("password")
    .isLength({
      min: 5
    })
    .withMessage("minimum length of 5")
  ],
  createUser
);

//endpoint to login already created user account
app.post("/auth/signin", userLogin);

//endpoint to get a user details
app.get("/me", verifyToken, getUser);

app.listen(PORT, () => {
  console.log(`server statrted at https://localhost:${PORT}`);
});

module.exports = app;