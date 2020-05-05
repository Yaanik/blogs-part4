const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper =  require('./test_helper')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const api = supertest(app)

beforeEach(async () =>{
    await Blog.deleteMany({});

    const blogObjects = helper.blogs
        .map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('root', 10);
    const user = new User({username: 'root', passwordHash});

    await user.save()
});


describe('routes test', () => {
    test('get all blogs with correct response', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test('unique identifier is named id', async () => {
        const blogsAtStart = await helper.blogsInDb();

        const firstBlog = blogsAtStart[0]

        expect(firstBlog.id).toBeDefined()
    });

    test('post request creates a new post', async () => {

        const newBlog = {
            title: 'test title',
            author: 'new title',
            url: 'url',
            likes: 123
        };

        const user = {
            username: 'root',
            password: 'root'
        };

        await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .then(res => {
                return api
                    .post('/api/blogs')
                    .set('Authorization', ('Bearer ' + res.body.token))
                    .send(newBlog)
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
            })


        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

        const contents = blogsAtEnd.map(b => b.title);
        expect(contents).toContainEqual('test title')
    })

    test('if likes are missing from a new blog, they are equal to zero ', async () => {
        const newBlog = {
            title: 'test title',
            author: 'tester',
            url: 'http://url',
        }

        const user = {
            username: 'root',
            password: 'root'
        };

        await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .then(res => {
                return api
                    .post('/api/blogs')
                    .set('Authorization', ('Bearer ' + res.body.token))
                    .send(newBlog)
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
            })

        const blogsAtEnd = await helper.blogsInDb();
        const sentBlog = blogsAtEnd.find(b => b.title === 'test title');
        expect(sentBlog.likes).toEqual(0);
    })

    test('creating post with missing data returns 400', async () => {
        const newBlog = {
            author: '',
        };

        const user = {
            username: 'root',
            password: 'root'
        };

        await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .then(res => {
                return api
                    .post('/api/blogs')
                    .set('Authorization', ('Bearer ' + res.body.token))
                    .send(newBlog)
                    .expect(400)
                    .expect('Content-Type', /application\/json/);
            })

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.blogs.length);
    })
});

afterAll(() => {
    mongoose.connection.close();
});


/*
Write a test related to creating new blogs via the /api/blogs endpoint,
that verifies that if the title and url properties are missing from the request data,
the backend responds to the request with the status code 400 Bad Request.

Make the required changes to the code so that it passes the test.
* */