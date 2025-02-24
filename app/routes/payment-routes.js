import express from "express"
import paymentCltr from "../controllers/payment-cltr.js"

const router = express.Router()

router.post('/payments/checkout', paymentCltr.createPayment)
router.put('/payments/:stripeId/success', paymentCltr.updatePaymentStatus)
router.get('/getAllPayments',paymentCltr.getAllPayments)

export default router