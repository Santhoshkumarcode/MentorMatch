import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios"


export const createUser = createAsyncThunk('users/createUser', async ({ form, resetForm }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/users/register', form)
        console.log(response.data)
        resetForm()
        localStorage.setItem('token',(response.data.token))
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})
const userSlice = createSlice({
    name: 'users',
    initialState: {
        data: [],
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.data.push(action.payload)
        })
    }
})

export default userSlice.reducer