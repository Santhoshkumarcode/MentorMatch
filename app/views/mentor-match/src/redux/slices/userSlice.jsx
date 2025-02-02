    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
    import axios from "../../config/axios"


    export const createUser = createAsyncThunk('users/createUser', async ({ form, resetForm }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/users/register', form)
            resetForm()
            localStorage.setItem('token', (response.data.token))
            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.errors)
        }
    })

    export const loginUser = createAsyncThunk('/users/loginUser', async ({ form, resetForm }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/users/login', form)
            resetForm()
            localStorage.setItem('token', (response.data.token))
            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.errors)
        }
    })

    export const userProfile = createAsyncThunk('/users/userProfile', async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/users/profile', { headers: { Authorization: localStorage.getItem("token") } })
            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data)
        }
    })

    const userSlice = createSlice({
        name: 'users',
        initialState: {
            data: [],
            serverError: null
        },
        extraReducers: (builder) => {
            // register
            builder.addCase(createUser.fulfilled, (state, action) => {
                state.serverError = null
            })
            builder.addCase(createUser.rejected, (state, action) => {
                console.log(action.payload)
                state.serverError = action.payload
            })

            // login
            builder.addCase(loginUser.fulfilled, (state, action) => {
                state.serverError = null
            })
            builder.addCase(loginUser.rejected, (state, action) => {
                state.serverError = action.payload
            })

            // profile
            builder.addCase(userProfile.fulfilled, (state, action) => {
                state.data = action.payload
                state.serverError = null
            })
            builder.addCase(userProfile.rejected, (state, action) => {
                state.serverError = action.payload
            })
        }
    })
    export default userSlice.reducer