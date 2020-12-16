const supertest = require('supertest')
const { connection } = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const userObject = helper.initialUsers.map(user => new User({ ...user }))
  const promiseArray = userObject.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('User model', () => {
  describe('GET requests', () => {

    test('users are returned as json', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are three users', async () => {
      const response = await api.get('/api/users')
      expect(response.body.length).toBe(3)
    })

    test('the unique identifier property of the user is named id', async () => {
      const response = await api.get('/api/users')
      expect(response.body[0].id).toBeDefined()
    })
  })

  describe('POST requests', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'SamDha',
        name: 'Samundra Dhakal',
        password: 'SamDha',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Sandesh Dhakal',
        password: 'SanDha',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if username is smaller than 3 characters', async () => {

      const newUser = {
        username: 'SD',
        name: 'Samundra Dhakal',
        password: 'SamDha',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('creation fails if password is smaller than 3 characters', async () => {

      const newUser = {
        username: 'SamDha',
        name: 'Samundra Dhakal',
        password: 'sa',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
})

afterAll(() => {
  connection.close()
})