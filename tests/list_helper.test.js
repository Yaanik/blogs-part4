const testHelper = require('./test_helper')


describe('test for likes', () => {
    test('return author and likes with highest amount of likes', () => {

        const expected = {
            author: "Edsger W. Dijkstra",
            likes: 17
        };

        const result = testHelper.mostLikes(testHelper.blogs);
        expect(result).toEqual(expected)
    });

    test('return author with the most blogs', () => {

        const expected =  {
            author: 'Robert C. Martin',
            blogs: 3
        };

        const result = testHelper.mostBlogs(testHelper.blogs);
        expect(result).toEqual(expected)
    });

    test('return highest like from all posts', () => {

        const result = testHelper.favoriteBlog(testHelper.blogs)
        const compare = {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        };
        expect(result).toEqual(compare)
    });

    test('return all likes from all posts', () => {

        const result = testHelper.totalLikes(testHelper.blogs)
        expect(result).toBe(36)
    })
});