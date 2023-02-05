import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.info(`[DB INIT] MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
  } catch (err) {
    console.error('DB INIT' + err)
    process.exit(1)
  }
}
export default connectDB
