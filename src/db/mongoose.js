const mongoose = require('mongoose')
mongoose.connect(process.env.DB, {
})
mongoose.connect(
    process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, strictQuery: true },
    () => {
        console.log('Connected to MongoDB');
    }
)





