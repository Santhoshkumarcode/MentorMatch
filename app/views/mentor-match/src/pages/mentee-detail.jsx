import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import { addNewSkill, getAllSkills } from "../redux/slices/skillsSlice";
import { useNavigate } from "react-router-dom";
import { menteeUpdate } from "../redux/slices/menteeSlice";
import { toast } from "react-toastify";

const initialState = {
    linkedIn: '',
    skills: [],
    phoneNumber: '',
}

export default function MenteeDetail() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data: skills } = useSelector((state) => state.skills)
    const [selectedSkills, setSelectedSkills] = useState([])
    const { data } = useSelector((state) => state.users)

    const [form, setForm] = useState(initialState)
    const [clientErrors, setClientErrors] = useState(null)
    const errors = {}

    useEffect(() => {
        dispatch(getAllSkills())
    }, [dispatch])
    

    const runClientValidation = () => {
        if (form.linkedIn.trim().length === 0) {
            errors.linkedIn = "Linkedin url required"
        }
        if (form.phoneNumber.trim().length === 0) {
            errors.phoneNumber = "Phone number required"
        }
    }

    const handleChange = (selectedOption) => {
        setSelectedSkills(selectedOption)
        setForm({ ...form, skills: selectedOption.map(ele => ele.value) });
    }

    const handleCreateSkill = async(inputValue) => {
        try {
            const response = await dispatch(addNewSkill({ skill: inputValue })).unwrap();
    
            const newSkill = { value: response._id, label: response.skill };
    
            setSelectedSkills([...selectedSkills, newSkill]);
            setForm({ ...form, skills: [...form.skills, response._id] });
    
        } catch (err) {
            console.error("Error creating skill:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        runClientValidation()

        if (!data || !data._id) {
            console.error("id missing");
            return;
        }

        if (Object.keys(errors).length !== 0) {
            setClientErrors(errors)
            return
        } else {
            try {
                const resetForm = () => {
                    setForm(initialState);
                };
                await dispatch(menteeUpdate({ id: data?._id, form, resetForm })).unwrap()
                toast.success('successfully you have registered')
                navigate('/')
            } catch (err) {
                toast.error('fail to register.')
                console.log(err)
            }

        }
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl text-gray-800 mb-6 text-center font-semibold">Apply to be a Mentee</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex space-x-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter LinkedIn"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, linkedIn: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, linkedIn: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.linkedIn}</p>}
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                onChange={(e) => {
                                    setForm({ ...form, phoneNumber: e.target.value });
                                    setClientErrors((pre) => ({ ...pre, phoneNumber: '' }))
                                }}
                            />
                            {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.phoneNumber}</p>}
                        </div>
                    </div>

                    <CreatableSelect
                        isMulti
                        options={skills.map(ele => ({ value: ele._id, label: ele.skill }))}
                        value={selectedSkills}
                        onChange={handleChange}
                        onCreateOption={handleCreateSkill}
                        isClearable={true}
                        placeholder="Select or add skills"
                    />
                    <div>
                        {clientErrors && <p className="text-sm text-red-500 mt-1">{clientErrors.phoneNumber}</p>}

                    </div>

                    <div className="text-center">
                        <input
                            type="submit"
                            value="Apply as Mentee"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer"
                        />

                    </div>
                </form>
            </div>
        </div>
    );
}
