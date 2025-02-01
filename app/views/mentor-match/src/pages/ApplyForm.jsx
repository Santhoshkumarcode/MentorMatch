import { useSelector } from "react-redux"

export default function ApplyForm() {
    const { singleData } = useSelector((state) => state.mentors)

    return (
        <div>
            <h1 className="text-4xl font-semibold text-center mt-4">Apply to {singleData.userId.username}</h1>
            <form>
                <textarea className="border" name="" id="" placeholder="What is your main objective for this mentorship?"></textarea>
                <textarea className="border" name="" id="" placeholder="What is your main objective for this mentorship?"></textarea>
            </form>
        </div>
    )
}