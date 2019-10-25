"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _users_routes = _interopRequireDefault(require("./users_routes"));

var _rides_routes = _interopRequireDefault(require("./rides_routes"));

var _requests_routes = _interopRequireDefault(require("./requests_routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = function router(app) {
  app.use('/users', _users_routes["default"]);
  app.use('/rides', _rides_routes["default"]);
};

var _default = router;
exports["default"] = _default;