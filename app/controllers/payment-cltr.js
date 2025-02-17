import Payment from "../models/payment-model";
import Stripe from "stripe"
import dotenv from "dotenv"
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentCltr = {}

paymentCltr.createPayment = async (req, res) => {
    try {
        
        const { menteeId, mentorId } = req.body
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: body.userId.username
                    },
                    unit_amount: body.amount * 100
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "",
            cancel_url: "",
            // customer:customer._id
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

export default paymentCltr