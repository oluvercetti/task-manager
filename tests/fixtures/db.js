const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@gatwick.com',
    password: '1qazZAQ!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.TOKEN_SECRET_KEY)
    }]
}

const setupDatabases = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOne,
    userOneId,
    setupDatabases,
}