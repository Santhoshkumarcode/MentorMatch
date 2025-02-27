import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getSummary = createAsyncThunk('/summaries/getSummary', async ({menteeId}, { rejectWithValue }) => {
    try {
        const response = await axios(`/api/summaries/${menteeId}`)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})
const summarySlice = createSlice({
    name: "summaries",
    initialState: {
        data: null,
        serverError: null,
    },
    extraReducers: (builder) => {
        builder.addCase(getSummary.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export default summarySlice.reducer