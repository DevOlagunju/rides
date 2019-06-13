import express from "express";
import usersRoute from "./users-routes";
import ridesRoute from "./rides-routes";
import requestsRoute from "./requests-routes";

const router = app => {
  app.use('/users', usersRoute);
  app.use('/rides', ridesRoute);
};

export default router;
