import express from 'express';
import bodyParser from 'body-parser';
import { createRide, getAllRideTwo, getRide} from '../controllers/rides_controllers';
import { getAllUser} from '../controllers/users_controller';
import { acceptOrRejectRequest} from '../controllers/requests_controllers';

import { check } from 'express-validator/check';
import { verifyToken } from '../middlewares/middleware.js';
var router = express.Router()


  //endpoint to create a ride offer
router.post("/rides",
[ check('phone_no', 'must be a valid mobile number').isMobilePhone()],
 verifyToken, createRide);

 //endpoint to get all users
router.get('/', verifyToken, getAllUser);
 
//endpoint to get a ride details
router.get("/:id/rides/:rideId", verifyToken, getRide);

//endpoint to get all ride offers
router.get("/:id/rides", verifyToken, getAllRideTwo);

//endpoint to change status of request only accessible by admin
router.put('/rides/:rideId/requests/:requestId', verifyToken, acceptOrRejectRequest)
   

export default router;
