//import express from "express";
const usersRoute = require("./users_routes");
const ridesRoute  = require("./rides_routes");

const router = app => {
  app.use("/users", usersRoute);
  app.use("/rides", ridesRoute);
};

module.exports = router;
