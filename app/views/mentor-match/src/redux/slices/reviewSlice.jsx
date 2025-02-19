import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getReviews = createAsyncThunk('/reviews/getReviews', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/reviews/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        return response.data
    } catch (err) {
        console.log(err)
        rejectWithValue(err.response.data.errors)
    }
})

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        data: [],
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(getReviews.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export default reviewSlice.reducer  