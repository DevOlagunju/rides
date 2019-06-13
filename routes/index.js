import express from "express";
import usersRoute from "./users_routes";
import ridesRoute from "./rides_routes";
import requestsRoute from "./requests_routes";

const router = app => {
  app.use('/users', usersRoute);
  app.use('/rides', ridesRoute);
};

export default router;
