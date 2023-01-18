const express = require('express')
require("./db/mongoose")

const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("server is up and running at port " + port)
})
// const User = require('./models/user')
// const main = async () => {
//     const user = await User.findById('63c680c691ab1d4aea5956a0')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()