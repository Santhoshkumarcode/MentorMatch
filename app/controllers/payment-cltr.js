import Payment from "../models/payment-model.js";
import Stripe from "stripe"
import _ from "lodash"

import dotenv from "dotenv"
import Mentor from "../models/mentor-model.js";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentCltr = {}

paymentCltr.createPayment = async (req, res) => {

    const body = _.pick(req.body, ['mentorId', 'menteeId', 'amount'])
    try {
        const mentor = await Mentor.findOne({ userId: body.mentorId });
        if (!mentor || !mentor.stripeAccountId) {
            return res.status(400).json({ error: "Mentor is not connected to Stripe" });
        }

        const adminFee = Math.round(body.amount * 0.20);
        const mentorFee = Math.round(body.amount * 0.80);

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
            payment_intent_data: {
                application_fee_amount: adminFee * 100, 
                transfer_data: {
                    destination: mentor.stripeAccountId 
                }
            },

            mode: "payment",
            success_url: `http://localhost:5173/payment-success/mentor/${body.mentorId._id}/mentee/${body.menteeId._id}`,
            cancel_url: "http://localhost:5173/payment-rejected",
            customer: customer.id
        })

        // payment creation 
        const payment = new Payment({
            mentorId: body.mentorId._id,
            menteeId: body.menteeId._id,
            transactionId: session.id,
            mentorName: body.mentorId.username,
            amount: body.amount,
            adminFee: adminFee,
            mentorFee: mentorFee
        });
        await payment.save();
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

paymentCltr.getAllPayments = async (req, res) => {
    try {
        const payment = await Payment.find()
        return res.status(200).json(payment)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default paymentCltr