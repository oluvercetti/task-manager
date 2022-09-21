
const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema( {
    description: {
        type: String,
        required: true,
    },

    completed: {
        type: Boolean,
        required: true
    }
})

taskSchema.pre('save', function (next) {
    const task = this
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task