const express = require('express')
// require("./db/mongoose")
const connectDB = require('./db/mongoose')
const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

connectDB().then(() => {
    app.listen(port, () => {
        console.log("server is up and running at port " + port)
    })
})
