import  Express  from "express";
import registerController from '../controllers/auth.controller.js'

const router=Express.Router();

router.post('/register',registerController)

export default router 
