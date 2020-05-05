const _ = require('lodash');
const Blog = require('../models/blog');
const User = require('../models/user')

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]


const usersIbDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON());
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON());
}

const dummy = (blogs) => {
    return 1
}

const favoriteBlog = (blogs) => {
    const max = Math.max(...blogs.map(({likes}) => likes))
    return blogs.find(({likes}) => likes === max)
};

const totalLikes = (blogs) =>{
    return blogs.reduce((a, {likes}) => a + likes, 0);
};

const mostBlogs = (blogs) => {
    const authorship = _.countBy(blogs, 'author');
    const max = _.max(Object.entries(authorship), o => authorship[o]);
    return {
        author: max[0],
        blogs: max[1]
    };
};

const mostLikes = (blogs) => {
    return _
        .chain(blogs)
        .groupBy('author')
        .map((group, author) => ({author, likes: _.sumBy(group, 'likes')}))
        .value()
        .reduce((max, blog) => max.likes > blog.likes ? max : blog)
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    blogs,
    blogsInDb,
    usersIbDb
}

