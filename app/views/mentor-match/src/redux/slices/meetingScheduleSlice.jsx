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

export const statusUpdate = createAsyncThunk('/meetingSchedules/statusUpdate', async ({ meetingId }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/meetings/${meetingId}`, { status: "scheduled" }, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getAcceptedStudent = createAsyncThunk('/meetingSchedules/getAcceptedStudent', async ({ mentorId }, { rejectWithValue }) => {
    console.log(mentorId)
    try {
        const response = await axios.get(`/api/meetings/scheduled/${mentorId}`, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const rejectStatus = createAsyncThunk('/meetingSchedules/rejectStatus', async ({ meetingId }, { rejectWithValue }) => {
    console.log(meetingId)
    try {
        const response = await axios.put(`/api/meetings/${meetingId}`, { status: "canceled" }, { headers: { Authorization: localStorage.getItem('token') } })
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
        acceptedData:[],
        serverError: null
    },

    extraReducers: (builder) => {

        // to get all student
        builder.addCase(getAllMyStudent.fulfilled, (state, action) => {
            state.data = action.payload
            state.serverError = null
        })
        builder.addCase(getAllMyStudent.rejected, (state, action) => {
            state.serverError = action.payload;
        });

        // update the status to scheduled
        builder.addCase(statusUpdate.fulfilled, (state, action) => {
            const index = state.data.findIndex(ele => ele._id === action.payload._id)
            if (index !== -1) {
                state.data[index] = action.payload
            }
            state.serverError = null
        })

        // update the status to cancelled
        builder.addCase(rejectStatus.fulfilled, (state, action) => {
            const index = state.data.findIndex(ele => ele._id === action.payload._id)
            if (index !== -1) {
                state.data[index] = action.payload
            }
            state.serverError = null
        })

        // students after accepted by mentor
        builder.addCase(getAcceptedStudent.fulfilled, (state, action) => {
            state.acceptedData = action.payload
            state.serverError = null
        })
    }
})

export default meetingScheduleSlice.reducer