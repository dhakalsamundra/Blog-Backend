const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = {
    username: 'root',
    name: 'admin',
    password: 'root',
  }
  const signedUpUser = await api.post('/api/users').send(user)

  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: signedUpUser.body.id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Blog model', () => {
  describe('GET requests', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are four blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('the unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })
  })

  describe('POST requests', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      const user = {
        username: 'root',
        password: 'root'
      }
      const SignInUser = await api.post('/api/login').send(user)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${SignInUser.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
      const contents = blogsAtEnd.map(n => n.title)
      expect(contents).toContain(
        'Type wars'
      )
    })

    test('if likes property is missing, it will get value 0', async() => {
      const newBlog = {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        __v: 0
      }
      const user = {
        username: 'root',
        password: 'root'
      }
      const SignInUser = await api.post('/api/login').send(user)

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '.concat(SignInUser.body.token))
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const likes = blogsAtEnd.map(n => n.likes)
      expect(likes).not.toContain(undefined)
    })

    test('if backend responds with 400 if title and url are missing', async() => {
      const newBlog = {
        author: 'Samundra',
        likes: 2,
      }
      const user = {
        username: 'root',
        password: 'root'
      }
      const SignInUser = await api.post('/api/login').send(user)

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '.concat(SignInUser.body.token))
        .send(newBlog)
        .expect(400)

      const response = await helper.blogsInDb()
      expect(response).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('PUT requests', () => {
    test('succeeds with valid data', async () => {
      // Update the blog from 120 to 125 likes.
      const blogsAtStart = await helper.blogsInDb()
      const blog = '5f7d91832f69e1a09f099260'
      const updateBlog = { likes: 20 }
      const user = {
        username: 'root',
        password: 'root'
      }
      const SignInUser = await api.post('/api/login').send(user)

      const updatedBlog = await api
        .put(`/api/blogs/${blog}`)
        .set('Authorization', 'Bearer '.concat(SignInUser.body.token))
        .send(updateBlog)
        .expect(200)
      expect(updatedBlog.body.likes).toBe(20)
    })
  })

  describe('DELETE requests', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const user = {
        username: 'root',
        password: 'root'
      }
      const SignInUser = await api.post('/api/login').send(user)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer '.concat(SignInUser.body.token))
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const author = blogsAtEnd.map(r => r.author)
      expect(author).not.toContain(blogToDelete.author)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})