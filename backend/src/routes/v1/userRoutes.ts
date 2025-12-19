import express from "express";
import { findUser, getProfile, isAvailable, Login, SignIn, updateUser } from "../../controllers/userController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validateData } from "../../middlewares/validateMiddleware.js";
import { LogBody, SignBody, UpdateBody, UsernameBody } from "../../schema/zod.js";
const router = express.Router();


router.post("/login", validateData(LogBody), Login)
router.post("/signin", validateData(SignBody), SignIn)
router.put("/update", validateData(UpdateBody), authMiddleware, updateUser);
router.get("/username", validateData(UsernameBody), isAvailable);
router.get('/find/:query', authMiddleware, findUser)
router.get('/', authMiddleware, getProfile)


export default router 