import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CreatableSelect from "react-select/creatable";
import { getAllSkills, addNewSkill } from "../redux/slices/skillsSlice"
import { menteeUpdate } from "../redux/slices/menteeSlice"

const initialState = {
    profilePic: '',
    bio: '',
    location: '',
    education: [{
        startYear: '',
        endYear: '',
        institute: '',
        degree: '',
        fieldOfStudy: '',
    }],
    skills: [],
    linkedIn: '',
    phoneNumber: ''
}

export default function MenteeProfilePage({ data }) {

    const [showForm, setShowForm] = useState(false)
    const { data: skills } = useSelector((state) => state.skills)
    const [selectedSkills, setSelectedSkills] = useState([])
    const [form, setForm] = useState(initialState)

    const id = data?.userId?._id

    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAllSkills())
    }, [dispatch])

    const handleChange = (selectedOption) => {
        setSelectedSkills(selectedOption)
        setForm({ ...form, skills: selectedOption.map(ele => ele.value) });
    }

    const handleCreateSkill = (inputValue) => {
        
        const newSkill = { value: inputValue, label: inputValue }
        setSelectedSkills([...selectedSkills, newSkill]);
        setForm({ ...form, skills: [...form.skills, inputValue] });

        dispatch(addNewSkill({ skill: inputValue }));
    };

    const handleSubmit = (e) => {
        console.log(form)
        e.preventDefault()
        if (id) {
            dispatch(menteeUpdate({ id, form })).unwrap()
            setShowForm(false)
        }
    }

    const addEducation = () => {
        setForm({
            ...form,
            education: [...form.education, { startYear: '', endYear: '', institute: '', degree: '', fieldOfStudy: '' }]
        });
    };
    const handleRemove = (index) => {
        setForm({
            ...form,
            education: form.education.filter((_, i) => i !== index),
        });
    }

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...form.education];
        updatedEducation[index][field] = value;
        setForm({ ...form, education: updatedEducation });
    };


    return (
        <div>
            <div className="bg-cyan-900 w-full h-60">
                <img className="w-10 h-10 absolute right-6 top-71 cursor-pointer" src="/src/assets/a.png" onClick={() => { setShowForm(true) }} />
                <div className="">
                    <div>
                        <img className="absolute top-50 left-10 w-50 h-50 rounded-full" src={data.profilPic} />
                        <p className="text-3xl font-semibold ps-10 pt-80">{data?.userId?.username}</p>
                        <p className="text-xl ps-10">{data?.linkedIn}</p>
                        <p className="text-xl ps-10">{data?.phoneNumber}</p>
                        <p className="text-xl ps-10">{data?.skills.skill}</p>
                        <p className="text-xl ps-10">{data?.education}</p>
                        <p className="text-xl ps-10">{data?.location}</p>
                    </div>
                </div>
            </div>


            {showForm && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-gray-800">✖</button>

                        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>


                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input className="border rounded-full w-20 h-20 bg-gray-300" type="file" accept="image/*"
                                onChange={(e) => { setForm({ ...form, profilePic: e.target.files[0] }) }} />
                            <span className="absolute top-30 left-28">Upload image</span>

                            <div className="flex w-full">
                                <input
                                    className="w-full border border-gray-300 p-2 rounded"
                                    type="text"
                                    placeholder="Enter Bio"
                                    onChange={(e) => { setForm({ ...form, bio: e.target.value }) }}
                                />

                                <input
                                    className="w-full border border-gray-300 p-2 rounded"
                                    type="text"
                                    placeholder="Enter Location"
                                    onChange={(e) => { setForm({ ...form, location: e.target.value }) }}
                                />
                            </div>

                            <p>Education</p>
                            {form.education.map((education, index) => (
                                <div key={index} className="flex border border-gray-300 mb-2">
                                    <input type="text" placeholder="Start Year" value={education.startYear}
                                        onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)} />
                                    <input type="text" placeholder="End Year" value={education.endYear}
                                        onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)} />
                                    <input type="text" placeholder="Institute" value={education.institute}
                                        onChange={(e) => handleEducationChange(index, 'institute', e.target.value)} />
                                    <input type="text" placeholder="Degree" value={education.degree}
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                                    <input type="text" placeholder="Field of Study" value={education.fieldOfStudy}
                                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)} />
                                    <btton className="bg-red-600 text-white py-1 px-4 rounded-md shadow hover:bg-red-700" onClick={() => { handleRemove(index) }}>delete</btton>
                                </div>
                            ))}

                            <button type="button" onClick={addEducation} className="bg-blue-600 text-white py-1 px-4 rounded-lg shadow hover:bg-blue-700">
                                Add Education
                            </button>

                            <CreatableSelect
                                isMulti
                                options={skills.map(ele => ({ value: ele._id, label: ele.skill }))}
                                value={selectedSkills}
                                onChange={handleChange}
                                onCreateOption={handleCreateSkill} 
                                isClearable={true}
                                placeholder="Select or add skills"
                            />

                            <div className="flex w-full my-8">
                                <input className="flex border rounded p-2 w-full border-gray-300" type="text" placeholder="LinkedIn"
                                    onChange={(e) => { setForm({ ...form, linkedIn: e.target.value }) }} />
                                <input className="flex border rounded p-2 w-full border-gray-300" type="number" placeholder="Phone Number"
                                    onChange={(e) => { setForm({ ...form, phoneNumber: e.target.value }) }} />
                            </div>
                            <input
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700" value="save" />
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}