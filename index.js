import express from "express"
import configDb from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"

import userRoutes from "./app/routes/user-routes.js"
import mentorRoutes from "./app/routes/mentor-routes.js"
const app = express()

dotenv.config()
configDb()

//middlewares
app.use(express.json())
app.use(cors())

//user route
app.use('/api', userRoutes)

//mentor route
app.use('/api', mentorRoutes)

app.listen(process.env.PORT, () => console.log(`server running in port: ${process.env.PORT}`))