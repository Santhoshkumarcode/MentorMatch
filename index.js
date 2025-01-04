import express from "express"
import configDb from "./config/db.js"
import dotenv from "dotenv"

import userRoutes from "./app/routes/user-routes.js"
const app = express()

dotenv.config()
configDb()

//middlewares
app.use(express.json())

//user route
app.use('/api',userRoutes)

app.listen(process.env.PORT,()=> console.log(`server running in port: ${process.env.PORT}`))