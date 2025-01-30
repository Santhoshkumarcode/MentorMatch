import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import mentorReducer from "./slices/mentorSlice"

const store = configureStore({
    reducer: {
        users: userReducer,
        mentors: mentorReducer
    }
})

export default store 