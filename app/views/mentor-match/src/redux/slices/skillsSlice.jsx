import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getAllSkills = createAsyncThunk('/skills/getAllSkills', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/skills', { headers: { Authorization: localStorage.getItem('token') } })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const addNewSkill = createAsyncThunk('/skills/addNewSkill', async ({ skill }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/skills', { skill }, { headers: { Authorization: localStorage.getItem('token') } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})


const skillSlice = createSlice({
    name: "skills",
    initialState: {
        data: [],
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(getAllSkills.fulfilled, (state, action) => {
            state.data = action.payload
        })
        builder.addCase(addNewSkill.fulfilled, (state, action) => {
            state.data.push(action.payload)
        })
    }
})

export default skillSlice.reducer