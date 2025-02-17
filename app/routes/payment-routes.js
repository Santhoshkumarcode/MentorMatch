import express from "express"
import paymentCltr from "../controllers/payment-cltr"
const router = express.Router()

router.get('/payments/checkout',paymentCltr.createPayment)

export default router