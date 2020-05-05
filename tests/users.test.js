const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app');
const api = supertest(app);

describe('user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('root', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    });
    test('Creation succeeds with a fresh username ', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            username: 'bigboss',
            name: 'Naked Snake',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    })
    test('Creating user with a used username returns a message and status code', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            username: 'root',
            name: 'not root',
            password: 'pass'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtEnd.length)
    })

    test('username with less than 3 chars are not saved, returns a suitable error code', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            username: 'rt',
            name: 'not root',
            password: 'pass'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('is shorter than the minimum allowed length')

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('passwords with less than 3 chars are not saved, returns a suitable error code', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            username: 'ro1t',
            name: 'not root',
            password: 'ps'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('incorrect password')

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('users with missing username are not created, returns proper error code', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            name: 'not root',
            password: 'pass'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Path `username` is required')

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('users with missing password are not created, returns proper error code', async () => {
        const usersAtStart = await helper.usersIbDb()

        const newUser = {
            username: 'root123',
            name: 'not root'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('incorrect password')

        const usersAtEnd = await helper.usersIbDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
});