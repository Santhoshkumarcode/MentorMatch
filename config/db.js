import mongoose from "mongoose";

const configDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to DB')
    } catch(err) {
        console.log('error in connecting to DB')
    }
}
export default configDb