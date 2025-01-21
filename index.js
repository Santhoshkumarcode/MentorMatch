import express from "express"
import configDb from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"

import userRoutes from "./app/routes/user-routes.js"
import mentorRoutes from "./app/routes/mentor-routes.js"
import skillRoutes from "./app/routes/skills-routes.js"
import menteeRoutes from "./app/routes/mentee-routes.js"
import reviewRoutes from "./app/routes/review-routes.js"
import meetingRoutes from "./app/routes/meetingSchedule-routes.js"

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

//skills route
app.use('/api', skillRoutes)

//mentee route
app.use('/api', menteeRoutes)

// review route
app.use('/api', reviewRoutes)

// meeting schedule route
app.use('/api', meetingRoutes)

app.listen(process.env.PORT, () => console.log(`server running in port: ${process.env.PORT}`))