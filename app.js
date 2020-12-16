const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogRouter = require('./controllers/blogs')
const testRouter = require('./controllers/test')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true, useFindAndModify: false,  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  console.log('cypress',process.env.NODE_ENV)
  app.use('/api/test', testRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// to avoid the try catch we can import this
// require('express-async-errors')

module.exports = app