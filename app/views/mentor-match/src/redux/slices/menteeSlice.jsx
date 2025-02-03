import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";


export const menteeProfile = createAsyncThunk('/mentees/menteeProfile', async ({id}, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/mentees/profile/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data)
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
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(menteeProfile.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export default menteeSlice.reducer