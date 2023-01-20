import { connect, set } from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        set('strictQuery', false);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
    } catch (err) {
        console.log(err.red);
        process.exit(1);
    }
}
export default connectDB