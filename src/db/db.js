import mongoose, { connect } from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDatabase = async () => {
    try {
        const connects = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected :: DB_HOST: ${connects.connection.host}`)
    } catch (error) {
        console.error("Mongo_db_connection error:", error)
        process.exit(1)
    }
}
export default connectDatabase