import Payment from "../models/payment-model.js";
import Stripe from "stripe"
import _ from "lodash"

import dotenv from "dotenv"
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentCltr = {}

paymentCltr.createPayment = async (req, res) => {

    const body = _.pick(req.body, ['mentorId', 'menteeId', 'amount'])
    try {
        const customer = await stripe.customers.create({
            name: 'Testing',
            address: {
                line1: "India",
                postal_code: "517501",
                city: "Trichy",
                state: "TN",
                country: "US"
            }
        })


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: body.mentorId.username
                    },
                    unit_amount: body.amount * 100
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: `http://localhost:5173/payment-success/mentor/${body.mentorId._id}/mentee/${body.menteeId._id}`,
            cancel_url: "http://localhost:5173/payment-rejected",
            customer: customer._id
        })

        // payment creation 
        const payment = new Payment()
        payment.mentorId = body.mentorId._id,
            payment.menteeId = body.menteeId._id,
            payment.transactionId = session.id,
            payment.mentorName = body.mentorId.username,
            payment.amount = body.amount
        await payment.save()
        return res.json({ sessionId: session.id, url: session.url })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

paymentCltr.updatePaymentStatus = async (req, res) => {
    const stripeId = req.params.stripeId
    const { paymentStatus } = req.body
    try {
        const payment = await Payment.findOneAndUpdate(
            { transactionId: stripeId },
            { paymentStatus }, { new: true })
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        return res.status(200).json(payment)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default paymentCltr