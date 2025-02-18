import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const createPayment = createAsyncThunk('/payments/createPayment', async (form, { rejectWtihValues }) => {
    console.log(form)
    try {
        const response = await axios.post('/api/payments/checkout', form)
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWtihValues(err.response.data.errors)
    }
})

export const updatePaymentStatus = createAsyncThunk('/payments/updatePaymentStatus', async ({ stripeId }, { rejectWithValues }) => {
    try {
        const response = await axios.put(`/api/payments/${stripeId}/success`, { paymentStatus: 'succeeded' })
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValues(err.response.data.errors)
    }
})

const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        data: null,
        serverError: null
    },
    extraReducers: (builder) => {
        builder.addCase(createPayment.fulfilled, (state, action) => {
            state.data = action.payload
        })
    }
})

export default paymentSlice.reducer