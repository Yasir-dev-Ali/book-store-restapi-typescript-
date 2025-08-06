import { Router } from "express";
import { userLogin, userRegister } from "./userController";

const userRouter = Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);

export default userRouter;