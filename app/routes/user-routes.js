import express from "express"
import { checkSchema } from "express-validator"

import userCltr from "../controllers/user-cltr.js"
import { userLoginSchema, userRegisterSchema } from "../validations/user-validation-schema.js"
import { authentication } from "../middlewares/authentication.js"
const router = express.Router()

router.post('/users/register', checkSchema(userRegisterSchema), userCltr.register)
router.post('/users/login',checkSchema(userLoginSchema),userCltr.login)
router.get('/users/profile', authentication, userCltr.profile)


export default router