const supertest = require('supertest')
const { connection } = require('mongoose')

const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = {
    username: 'root',
    name: 'Admin',
    password: 'root',
  }
  await api.post('/api/users').send(user)
})

describe('while logging users with data', () => {
  test('logIn success with bearer token', async () => {
    const validUser = {
      username: 'root',
      password: 'root',
    }

    const user = await api
      .post('/api/login')
      .send(validUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(user.body.token).toBeDefined()
  })

  test('User is not register in the system', async () => {
    const invalidUser = {
      username: 'xxx',
      password: 'xxx',
    }

    const user = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(user.body.token).not.toBeDefined()
  })

  test('wrong username input prevent to login', async () => {
    const invalidUser = {
      username: 'abc',
      password: 'root',
    }

    const errorMsg = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(errorMsg.body.error).toContain('Invalid credentials')
  })

  test('wrong password input prevent to login', async () => {
    const invalidUser = {
      username: 'root',
      password: 'abc',
    }

    const errorMsg = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(errorMsg.body.error).toContain('Invalid credentials')
  })
})

describe('logging user with missing data', () => {
  test('can not login without  username', async () => {
    const missingUser = {
      password: 'root',
    }

    await api
      .post('/api/login')
      .send(missingUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  connection.close()
})
