import express from 'express';
import bodyParser from 'body-parser';
import { createRide, getAllRide, getRide} from '../controllers/rides-controllers';
import { getAllUser} from '../controllers/users-controller.js';
import { acceptOrRejectRequest} from '../controllers/requests-controllers';

import { check } from 'express-validator/check';
import { verifyToken } from '../middlewares/middleware.js';




const router = (app) => {

  //endpoint to create a ride offer
app.post("/users/rides", verifyToken, createRide);

 //endpoint to get all users
 app.get('/users', verifyToken, getAllUser);
 
//endpoint to get a ride details
app.get("/users/:id/rides/:rideId", verifyToken, getRide);

//endpoint to get all ride offers
app.get("/users/:id/rides", verifyToken, getAllRide);

//endpoint to change status of request only accessible by admin
app.put('/users/rides/:rideId/requests/:requestId', verifyToken, acceptOrRejectRequest)
   
}

export default router;
