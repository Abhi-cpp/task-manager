const mongoose = require('mongoose')
const connectDB = async () => {
    console.log(process.env.DB)
    try {
        const conn = await mongoose.connect(
            process.env.DB,
            { useNewUrlParser: true },
        )
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB




