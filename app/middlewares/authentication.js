import jwt from "jsonwebtoken"

export const authentication = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json('Token required')
    }
    const tokenData = jwt.verify(token,process.env.SECRET_KEY)
    req.currentUser = { userId: tokenData.userId, role: tokenData.role }
    next()
}