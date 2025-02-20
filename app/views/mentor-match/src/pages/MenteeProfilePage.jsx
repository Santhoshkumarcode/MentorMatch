import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CreatableSelect from "react-select/creatable";
import { getAllSkills, addNewSkill } from "../redux/slices/skillsSlice"
import { menteeProfile, menteeUpdate, updateMenteeProfilePic } from "../redux/slices/menteeSlice"
import { useParams } from "react-router-dom";
import { format } from "date-fns";


/* const initialState = {
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
} */

export default function MenteeProfilePage({ data }) {

    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        education: []
    })
    const [selectedSkills, setSelectedSkills] = useState([])
    const { data: skills } = useSelector((state) => state.skills)

    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        dispatch(menteeProfile({ id }))
    }, [dispatch, id])


    useEffect(() => {
        if (data && data.skills) {
            const prefilledSkills = data.skills.map(skill => ({
                value: skill._id,
                label: skill.skill,
            }));
            setSelectedSkills(prefilledSkills);
            setForm(prev => ({ ...prev, skills: prefilledSkills.map(s => s.value) }));
        }
    }, [data, id]);

    useEffect(() => {
        dispatch(getAllSkills())
    }, [dispatch])

    const handleChange = (selectedOption) => {
        setSelectedSkills(selectedOption)
        setForm({ ...form, skills: selectedOption.map(ele => ele.value) });
    }

    const handleCreateSkill = async (inputValue) => {
        const result = await dispatch(addNewSkill({ skill: inputValue }));
        if (result && result.payload) {
            const createdSkillOption = {
                value: result.payload._id,
                label: result.payload.skill,
            };
            setSelectedSkills([...selectedSkills, createdSkillOption]);
            setForm({
                ...form,
                skills: [...(form.skills || []), result.payload._id]
            });
        } else {
            console.error("Failed to add new skill");
        }
    };

    const handleClick = (data) => {
        setShowForm(true)
        setForm(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        dispatch(menteeUpdate({ id, form }))
        setShowForm(false)
    }

    const handleEducationChange = (index, field, value) => {
        setForm(prevForm => {
            const updatedEducation = [...(prevForm.education || [])];
            updatedEducation[index] = { ...updatedEducation[index], [field]: value };
            return { ...prevForm, education: updatedEducation };
        });
    };

    if (!data) {
        return <p>loading</p>
    }
    const formatDate = (date) => {
        return format(date, "yyyy-MM-dd")
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("profilePic", file);

        dispatch(updateMenteeProfilePic({ id: id, image: formData }));
    }
    const educationFields = 2;
    const educationArray = form?.education?.length >= educationFields
        ? form.education
        : [...form?.education || [], ...Array(educationFields - (form?.education?.length || 0)).fill({ startYear: '', endYear: '', institute: '', degree: '', fieldOfStudy: '' })];

    return (
        <div>
            <div className="bg-cyan-900 w-full h-60">

                <img className="w-12 h-12 absolute right-6 top-86 cursor-pointer" src="/src/assets/a.png" onClick={() => { handleClick(data) }} />

                <div className="">
                    <div>
                        <img className="border-4 border-white absolute top-55 left-10 w-50 h-50 rounded-full" src={data?.profilePic} />
                        <p className="text-3xl font-semibold ps-10 pt-80">{data?.userId?.username}</p>
                        <p className="text-lg ps-10 mt-2">{data?.bio}</p>
                        <p className="text-lg ps-10 mt-2 font-semibold text-blue-600 hover:underline cursor-pointer" target="_blank"><a src={data?.linkedIn}>LinkedIn</a></p>
                        <p className="text-md ps-10 mt-2">{data?.phoneNumber}</p>
                        <p className="text-md ps-10 mt-2">{data?.location}</p>

                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data?.skills?.map((skill, index) => (
                            <span key={index} className=" bg-gray-200 mb-6 ml-10 text-gray-700 px-3 py-1 rounded-full text-lg">
                                {skill.skill}
                            </span>
                        ))}
                    </div>

                    <hr />
                    <div>
                        <div className="px-10 py-6">
                            <h2 className="text-3xl font-semibold mb-6">Education</h2>
                            {data?.education?.length > 0 ? (
                                data.education.map((exp, i) => (
                                    <div key={i} className="p-6 mb-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                        <div className="flex flex-col md:flex-row md:justify-between">
                                            <div>
                                                <p className="text-xl font-bold text-gray-800">Institute - {exp?.institute}</p>
                                                <p className="text-lg font-semibold text-gray-600 mt-1">Degree - {exp?.degree}</p>
                                                <p className="text-lg font-semibold text-gray-600 mt-1">Field of Study - {exp?.fieldOfStudy}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-sm text-gray-500">
                                                    {exp?.startYear ? new Date(exp.startYear).getFullYear() : "N/A"}{" "}
                                                    -{" "}
                                                    {exp?.endYear ? new Date(exp?.endYear).getFullYear() : "Present"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-lg text-gray-500">No Education available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-2xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scale-105">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-gray-800">✖</button>

                        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>


                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                {form?.profilePic ? (
                                    <img
                                        className="w-20 h-20 rounded-full object-cover border"
                                        src={typeof form.profilePic === "string" ? form.profilePic : URL.createObjectURL(form.profilePic)}
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full border bg-gray-300 flex items-center justify-center">+
                                    </div>
                                )}

                                <input
                                    id="fileInput"
                                    className="absolute top-0 left-0 w-20 h-20 opacity-0 cursor-pointer"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <p>upload image</p>

                            <div className="flex w-full">
                                <input
                                    className="w-full border border-gray-300 p-2 rounded"
                                    type="text"
                                    value={form?.bio}
                                    placeholder="Enter Bio"
                                    onChange={(e) => { setForm({ ...form, bio: e.target.value }) }}
                                />

                                <input
                                    className="w-full border border-gray-300 p-2 rounded"
                                    type="text"
                                    value={form?.location}
                                    placeholder="Enter Location"
                                    onChange={(e) => { setForm({ ...form, location: e.target.value }) }}
                                />
                            </div>

                            <p className="text-xl">Education</p>
                            <div className="pb-4">
                                {educationArray.map((education, index) => (
                                    <div key={index} className="flex border border-gray-300 mb-2">
                                        <input
                                            type="date"
                                            placeholder="Start Year"
                                            value={education?.startYear ? formatDate(education.startYear) : ""}
                                            onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            placeholder="End Year"
                                            value={education?.endYear ? formatDate(education.endYear) : ""}
                                            onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Institute"
                                            value={education.institute}
                                            onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            value={education.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Field of Study"
                                            value={education.fieldOfStudy}
                                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                                        />
                                    </div>
                                ))}
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

                            <div className="flex w-full my-8">
                                <input className="flex border rounded p-2 w-full border-gray-300" type="text" value={form?.linkedIn} placeholder="LinkedIn"
                                    onChange={(e) => { setForm({ ...form, linkedIn: e.target.value }) }} />

                                <input className="flex border rounded p-2 w-full border-gray-300" type="number" value={form?.phoneNumber} placeholder="Phone Number"
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