const express = require('express')
const connectDB = require('./db/mongoose')
const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

connectDB()

module.exports = app
