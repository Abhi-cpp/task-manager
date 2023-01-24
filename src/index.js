const app = require('./app')
const port = process.env.PORT
const connectDB = require('./db/mongoose')

app.connectDB().then(() => {
    app.listen(port, () => {
        console.log("server is up and running at port " + port)
    })
})
