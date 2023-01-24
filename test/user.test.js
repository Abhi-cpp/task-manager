const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const user1id = new mongoose.Types.ObjectId
const user1 = {
    _id: user1id,
    name: "john snow",
    email: "john@gmail.com",
    password: "john@98",
    tokens: [{
        token: jwt.sign({ _id: user1id }, process.env.JWT_SECRET)
    }]
}
beforeEach(async () => {
    await User.deleteMany()
    await new User(user1).save()
})
test('Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: "abhishek Kumar Singh",
        email: "wihidan807@ukbob.com",
        password: "Abhishek9"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'abhishek Kumar Singh',
            email: 'wihidan807@ukbob.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Abhishek9')
})
test('should login user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)
    const user = await User.findById(user1._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('should not login nonexisting users', async () => {
    await request(app).post('/users/login').send({
        email: "took",
        password: "fook"
    }).expect(400)
})
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', user1.tokens[0].token)
        .send()
        .expect(200)
})
test('Should not get profile for unauthentication user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', user1.tokens[0].token)
        .send()
        .expect(200)

    const user = await User.findById(user1._id)
    expect(user).toBeNull()
})