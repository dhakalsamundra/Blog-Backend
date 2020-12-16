const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
  if (req.body.password.length < 3) {
    return res.status(400).json({ error:'Password length is shorter than 3' }).end()
  }
  if (req.body.username.length < 3) {
    return res.status(400).json({ error:'UserName length is shorter than 3' }).end()
  }
  const body = req.body
  const saltRounds = 10
  const user = await User.findOne({ username: body.username })
  if(user){
    res.status(400).json({ error: '`username` to be unique' })
  } else {
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      blogs: body.blogs,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }
})

module.exports = usersRouter