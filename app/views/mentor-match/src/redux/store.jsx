import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import mentorReducer from "./slices/mentorSlice"
import meetingScheduleReducer from "./slices/meetingScheduleSlice"

const store = configureStore({
    reducer: {
        users: userReducer,
        mentors: mentorReducer,
        meetingSchedules: meetingScheduleReducer
    }
})

export default store 