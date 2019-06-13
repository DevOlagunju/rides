import express from "express";
import bodyParser from "body-parser";
import {
  createRequest,
  getAllRequest
} from "../controllers/requests-controllers.js";
import { check } from "express-validator/check";
import { verifyToken } from "../middlewares/middleware.js";

const router = (app) => {
    
  //endpoint to create a request for a rideoffer
app.post('/rides/requests',[
  check('phone_no', 'must be a valid mobile number').isMobilePhone()
  ],verifyToken, createRequest); 
  
  
  //endpoint to get a specific request details
  // app.get('/users/rides/:rideId/requests', verifyToken, getRequest);
  
  //endpoint to get all requests
  app.get('/rides/:rideId/requests', verifyToken, getAllRequest);
  
     
}

export default router;

