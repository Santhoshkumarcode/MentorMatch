import express from "express"
import skillsCltr from "../controllers/skills-cltr.js"
import { authentication } from "../middlewares/authentication.js"

const router = express.Router()

router.post('/skills', authentication, skillsCltr.create)
router.get('/skills', authentication, skillsCltr.getAll)

export default router