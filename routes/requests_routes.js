import express from 'express';
import bodyParser from 'body-parser';
import { check } from 'express-validator/check';
import { verifyToken } from '../middlewares/middleware.js';
import { createRequest, getAllRequest } from '../controllers/requests_controllers';




