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
    try {
        const response = await axios.get(`/api/meetings/scheduled/${mentorId}`, { headers: { Authorization: localStorage.getItem('token') } })
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

export const updateMeeting = createAsyncThunk('/meetingSchedules/updateMeeting', async ({ meetingId, form }, { rejectWithValue }) => {
    console.log(meetingId, form)
    try {
        const response = await axios.put(`/api/meetings/${meetingId}`, form, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getMeetings = createAsyncThunk('/meetingSchedules/getMeetings', async ({ mentorId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/meetings/mentor/${mentorId}`, { headers: { Authorization: localStorage.getItem('token') } })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getMeetingsOfMentee = createAsyncThunk('/meetingSchedules/getMeetingsOfMentee', async ({ menteeId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/meetings/mentee/dates/${menteeId}`, { headers: { Authorization: localStorage.getItem('token') } })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getMenteeBookings = createAsyncThunk('/meetingSchedules/getMenteeBookings', async ({ menteeId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/meetings/mentee/${menteeId}`, { headers: { Authorization: localStorage.getItem('token') } })
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
        acceptedData: [],
        meetingDates: [],
        menteeMeetingDates:[],
        menteeBookings:[],
        serverError: null
    },

    extraReducers: (builder) => {


        //request booking rejected
        builder.addCase(requestBooking.rejected, (state, action) => {
            state.serverError = action.payload
        })
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
        builder.addCase(updateMeeting.fulfilled, (state, action) => {
            const index = state.data.findIndex(ele => ele._id === action.payload._id)
            if (index !== -1) {
                state.data[index] = action.payload
            }
            state.serverError = null
        })

        //meetings for this mentor

        builder.addCase(getMeetings.fulfilled, (state, action) => {
            state.meetingDates = action.payload
        });

        builder.addCase(getMenteeBookings.fulfilled, (state, action) => {
            state.menteeBookings = action.payload
        })

        builder.addCase(getMeetingsOfMentee.fulfilled, (state, action) => {
            state.menteeMeetingDates = action.payload
        })
    }
})

export default meetingScheduleSlice.reducer