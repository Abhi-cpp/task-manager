const express = require('express')
require("./db/mongoose")

const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')

const port = process.env.PORT || 3000
const app = express()

app.use((req, res, next) => {
    if (req.method == 'GET')
        res.send('get request are disable')
    else next()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("server is up and running at port" + port)
})