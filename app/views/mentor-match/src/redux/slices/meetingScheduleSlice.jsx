import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const requestBooking = createAsyncThunk('/meetingSchedules/requestBooking', async ({ form, resetForm }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/meetings/', form, { headers: { Authorization: localStorage.getItem('token') } })
        resetForm()
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }

})

export const getAllMyStudent = createAsyncThunk('/meetingSchedules/getAllMyStudent', async ({ mentorId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/meetings/request/${mentorId}`, { headers: { Authorization: localStorage.getItem('token') } })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const statusUpdate = createAsyncThunk('/meetingSchedules/statusUpdate', async ({meetingId}, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/meetings/:meetingId`, { status: "scheduled" }, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})
const meetingScheduleSlice = createSlice({
    name: 'meetingSchedules',
    initialState: {
        data: [],
        serverError: null
    },

    extraReducers: (builder) => {
        builder.addCase(getAllMyStudent.fulfilled, (state, action) => {
            state.data = action.payload
            state.serverError = null
        })
        builder.addCase(getAllMyStudent.rejected, (state, action) => {
            state.serverError = action.payload;
        });
    }
})

export default meetingScheduleSlice.reducer