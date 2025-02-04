import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import mentorReducer from "./slices/mentorSlice"
import meetingScheduleReducer from "./slices/meetingScheduleSlice"
import menteeReducer from "./slices/menteeSlice"
import skillReducer from "./slices/skillsSlice"

const store = configureStore({
    reducer: {
        users: userReducer,
        mentors: mentorReducer,
        mentees: menteeReducer,
        skills: skillReducer,
        meetingSchedules: meetingScheduleReducer
    }
})

export default store 