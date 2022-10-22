const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setupDatabases} = require('./fixtures/db')

beforeEach(setupDatabases)

test('should signup a new user', async () => {
   const response = await request(app).post('/users').send({
        name: 'Ayodeji',
        email: 'olu_first@test.com',
        password: 'erujeje123',
        age: 31
    }).expect(200)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
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

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('vercetti-token', `${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('vercetti-token', `${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/sample image.jpeg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})