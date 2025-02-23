import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { requestBooking } from "../redux/slices/meetingScheduleSlice"
import { toast } from "react-toastify"

export default function ApplyForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { mentorId, plan, amount } = useParams()
    const { singleData } = useSelector((state) => state.mentors)


    const [form, setForm] = useState({
        mentorshipGoal: '',
        plan,
        mentorId,
        amount,
    })
    const [clientErrors, setClientErrors] = useState(null)
    const errors = {}

    const runClientValidation = () => {
        if (form.mentorshipGoal.trim().length === 0) {
            errors.mentorshipGoal = "This field required"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        runClientValidation()

        const resetForm = () => {
            setForm({
                mentorshipGoal: '',
            })
        }

        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors)
        } else {
            try {

                dispatch(requestBooking({ form, resetForm })).unwrap()
                toast.success('Your application successfully submitted...')
                navigate('/')

            } catch (err) {
                toast.success('Your application rejected...')
                console.log(err)
            }
        }
    }
    return (
        <div>
            <h1 className="text-4xl font-semibold text-center my-8">Apply to {singleData?.userId?.username}</h1>
            <form className="text-center" onSubmit={handleSubmit}>
                <textarea className="w-80 p-2 border rounded-md" rows="2" name="" id="" placeholder="What is your main objective for this mentorship?"
                    onChange={(e) => {
                        setForm({ ...form, mentorshipGoal: e.target.value }),
                            setClientErrors((pre) => ({ ...pre, mentorshipGoal: '' }))
                    }}>
                </textarea><br />
                {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.mentorshipGoal}</p>}
                {/* <textarea className="w-80 p-2 border rounded-md" rows="2" name="" id="" placeholder="What is your main objective for this mentorship?"></textarea><br/> 
                <label className="text-xl">Why i want to mentor you ?</label><br />
                <div className="w-80 h-30 border justify-self-center mt-4"></div>
                */}
                <input className="mt-8 bg-blue-500 w-80 text-white px-8 py-2 rounded-lg  hover:bg-blue-700" type="submit" value="Book" />
            </form>
        </div>
    )
}