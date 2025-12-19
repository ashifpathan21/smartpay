import express from "express";
import UserRoutes from "./userRoutes.js"
import AccountRoutes from "./accountRoutes.js"

const router = express.Router();

router.use('/user', UserRoutes)
router.use('/account', AccountRoutes)


export default router;