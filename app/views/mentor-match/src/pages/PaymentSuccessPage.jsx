import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { updatePaymentStatus } from "../redux/slices/paymentSlice"
import { paymentStatusUpdate } from "../redux/slices/meetingScheduleSlice"
import { useParams } from "react-router-dom"

export default function PaymentSuccess() {

    const {mentorId,menteeId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            try {
                const stripeId = localStorage.getItem('stripeId')
                dispatch(updatePaymentStatus({ stripeId }))
            } catch (err) {
                console.log(err)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                dispatch(paymentStatusUpdate({ mentorId, menteeId }))
            } catch (err) {
                console.log(err)
            }
        })()
    }, [dispatch,mentorId,menteeId])






    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-600">Payment Successful</h1>
                    <p className="mt-4 text-xl text-gray-700">
                        Congratulations! Your payment has been successfully processed. Thank you for your purchase.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}