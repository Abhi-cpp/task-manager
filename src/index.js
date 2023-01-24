const app = require('./app')
const port = process.env.PORT

app.connectDB().then(() => {
    app.listen(port, () => {
        console.log("server is up and running at port " + port)
    })
})
