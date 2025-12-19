import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { createAccount, getBalance, getTransactions, getTransactionsWithFriend, transferAmount } from "../../controllers/accountController.js";

const router = express.Router();

router.post('/create', authMiddleware, createAccount)
router.get('/balance', authMiddleware, getBalance)
router.post('/transfer', authMiddleware, transferAmount)
router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/:id", authMiddleware, getTransactionsWithFriend)



export default router;