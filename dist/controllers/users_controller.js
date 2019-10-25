"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUser = exports.getUser = exports.userLogin = exports.createUser = void 0;

var _check = require("express-validator/check");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var saltRounds = 10;

var createUser = function createUser(req, res) {
  var _req$body = req.body,
      first_name = _req$body.first_name,
      last_name = _req$body.last_name,
      email = _req$body.email,
      phone_no = _req$body.phone_no,
      password = _req$body.password;
  console.log('----req:', req.body);
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } else {
    _bcrypt["default"].hash(password, saltRounds, function (err, hash) {
      client.query('INSERT INTO users (first_name,last_name,email,phone_no,password) VALUES ($1, $2, $3, $4, $5)RETURNING *', [first_name, last_name, email, phone_no, hash], function (error, user) {
        if (error) {
          res.send({
            err: error.detail
          });
        } else {
          _jsonwebtoken["default"].sign({
            id: user.rows[0].id,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name,
            email: user.rows[0].email,
            phone_no: user.rows[0].phone_no,
            password: user.rows[0].password
          }, process.env.SECKRET_KEY, {
            expiresIn: "1h"
          }, function (err, token) {
            if (err) {
              res.send({
                msg: "Unable to encode token"
              });
            } else {
              res.status(201).send({
                success: true,
                msg: "user added successfully",
                token: token,
                expiresIn: "24hours",
                userId: user.rows[0].id
              });
            }
          });
        }
      });
    });
  }
};

exports.createUser = createUser;

var userLogin = function userLogin(req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;
  console.log('>>>>>>>>>>>>:', req.body);
  client.query("select * from users WHERE email = $1", [email], function (error, users) {
    if (error) {
      res.status(400).send({
        success: false,
        error: error.message
      });
    }

    console.log('>>>>>>>>>>>>:', users);
    var user = users.rows[0];
    console.log('>>>>>>>>>>>>:', user);

    if (!user) {
      res.send({
        success: false,
        msg: "Incorrect email or password"
      });
    }

    console.log("****", user);

    _bcrypt["default"].compare(password, user.password, function (err, response) {
      console.log(response);

      if (err) {
        res.send({
          success: false,
          error: error.message
        });
      }

      if (response === true) {
        _jsonwebtoken["default"].sign({
          id: user.id,
          email: user.email,
          password: user.password
        }, process.env.SECKRET_KEY, {
          expiresIn: "1h"
        }, function (err, token) {
          console.log(token);

          if (err) {
            res.status(400).send({
              success: false,
              error: error.message
            });
          } else {
            res.send({
              msg: "login successfully",
              token: token,
              expiresIn: "24hours"
            });
          }
        });
      }
    });
  });
};

exports.userLogin = userLogin;

var getUser = function getUser(req, res) {
  //const userId = parseInt(req.params.id)
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query("SELECT * FROM users WHERE id = ".concat(req.decoded.id), function (err, user) {
      if (err) {
        res.send(err);
        console.Console(err);
      } else {
        console.log('-------', user.rows[0]);
        res.status(200).send(user.rows[0]);
      }
    });
  }
};

exports.getUser = getUser;

var getAllUser = function getAllUser(req, res) {
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  } else {
    client.query("SELECT * FROM users", function (err, users) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(users.rows);
      }
    });
  }
};

exports.getAllUser = getAllUser;