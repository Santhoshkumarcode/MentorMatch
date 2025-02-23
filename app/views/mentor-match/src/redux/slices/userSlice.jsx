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

export const allUsers = createAsyncThunk('users/allUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/users/getAll')
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

const userSlice = createSlice({
    name: 'users',
    initialState: {
        data: null,
        allUsers: [],
        isLoggedIn: false,
        loading: false,
        serverError: null
    },
    reducers: {
        logout: (state, action) => {
            state.isLoggedIn = false
            state.data = null
        }
    },
    extraReducers: (builder) => {
        // register
        builder.addCase(createUser.pending, (state) => {
            state.loading = true;
            state.serverError = null;
        })
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.loading = false
            state.serverError = null
        })
        builder.addCase(createUser.rejected, (state, action) => {
            state.loading = false
            state.serverError = action.payload
        })


        // login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.serverError = null;
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.serverError = null
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.serverError = action.payload
        })

            // profile
            .addCase(userProfile.pending, (state) => {
                state.loading = true;
                state.serverError = null;
            })
        builder.addCase(userProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
            state.isLoggedIn = true
            state.serverError = null
        })
        builder.addCase(userProfile.rejected, (state, action) => {
            state.loading = false;
            state.serverError = action.payload
        })

        //get all
        builder.addCase(allUsers.pending, (state) => {
            // state.loading = true;
            state.serverError = null;
        })
        builder.addCase(allUsers.fulfilled, (state, action) => {
            state.loading = false
            state.allUsers = action.payload
        })
        builder.addCase(allUsers.rejected, (state, action) => {
            state.loading = false;
            state.serverError = action.payload
        })
    }
})
export const { logout } = userSlice.actions
export default userSlice.reducer