const mongoose = require('mongoose')

const taskManagerConnectionURL = process.env.MONGODB_CONNECTION_STRING

mongoose.connect(taskManagerConnectionURL, {
    useNewUrlParser: true,
})
