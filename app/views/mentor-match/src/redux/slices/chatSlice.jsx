import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getchats = createAsyncThunk('/chats/getChats', async ({ meetingId}, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/chats/${meetingId}`)
        console.log(response.data)
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data.errors)
    }
})
const chatSlice = createSlice({
    name: "chats",
    initialState: {
        data: [],
        servererror: null
    },
    extraReducers: (builder) => {
        builder.addCase(getchats.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export default chatSlice.reducer