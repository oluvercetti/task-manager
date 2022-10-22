const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')


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

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Ayodeji',
        email: 'olu_first@test.com',
        password: 'erujeje123',
        age: 31
    }).expect(200)
})

test('should login existing user', async () => {
    await request(app).post('/users/login').send({
        email:userOne.email,
        password: userOne.password
    }).expect(200)
})

test('should not login non existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'eruje'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('vercetti-token', `${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})
