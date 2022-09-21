const mongoose = require('mongoose')

const taskManagerConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(taskManagerConnectionURL, {
    useNewUrlParser: true,
})
