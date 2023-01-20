import mongoose from 'mongoose';

const connectDB = () => {
    try {
        const conn = mongoose.connect("mongodb://root:wTN4JY7Ek8akyB@10.10.10.204/toolkeeper?authSource=admin");
        mongoose.set('useCreateIndex', true)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
    } catch (err) {
        console.log(err.red);
        process.exit(1);
    }
}
export default connectDB;