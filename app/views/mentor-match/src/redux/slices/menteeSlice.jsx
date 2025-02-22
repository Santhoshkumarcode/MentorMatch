import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";


export const updateMenteeProfilePic = createAsyncThunk('/mentees/updateMenteeProfilePic', async ({ id, image }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/mentees/update/profilePic/${id}`, image, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const menteeProfile = createAsyncThunk('/mentees/menteeProfile', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/mentees/profile/${id}`, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const menteeUpdate = createAsyncThunk('/mentees/menteeUpdate', async ({ id, form }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/mentees/${id}`, form, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getAllMentee = createAsyncThunk('/mentees/getAllMentees', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/mentees', { headers: { Authorization: localStorage.getItem('token') } })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})


const menteeSlice = createSlice({
    name: "mentees",
    initialState: {
        data: [],
        allMentees: [],
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(menteeProfile.fulfilled, (state, action) => {
            state.data = action.payload
        })

        //update mentee profile pic
        builder.addCase(updateMenteeProfilePic.fulfilled, (state, action) => {
            state.data = action.payload
        })

        builder.addCase(menteeUpdate.fulfilled, (state, action) => {
            state.data = action.payload
        })

        //get all 
        builder.addCase(getAllMentee.fulfilled, (state, action) => {
            state.allMentees = action.payload
        })
    }
})

export default menteeSlice.reducer