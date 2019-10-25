"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var verifyToken = function verifyToken(req, res, next) {
  var token = req.param.token || req.headers['x-access-token'] || req.headers.authorization || req.body.token;

  if (token) {
    _jsonwebtoken["default"].verify(token, process.env.SECKRET_KEY, function (error, decoded) {
      if (error) {
        res.status(401).send({
          status: 'error',
          message: 'invalid token!'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Token required for this route'
    });
  }
};

exports.verifyToken = verifyToken;