const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5f7d91702f69e1a09f09925f',
    title: 'data info',
    author: 'Samundra',
    url: 'www.xxx.com',
    likes: 20,
  },
  {
    _id: '5f7d91832f69e1a09f099260',
    title: 'data science',
    author:'Sandesh',
    url:'www.xsandeshxx.com',
    likes:2
  },
  {
    _id: '5e980af337dbb30b51ce6e28',
    title: 'bio science',
    author: 'sandhya',
    url: 'www.sandhya.com',
    likes: 12
  },
  {
    _id: '5f7d91a92f69e1a09f099262',
    title: 'art and design',
    author: 'yojana',
    url: 'www.yojana.com',
    likes: 120
  },
]
const initialUsers = [
  {
    username: 'user1',
    name: 'user',
    password: 'password1'
  },
  {
    username: 'user2',
    name: 'user',
    password: 'password2'
  },
  {
    username: 'user3',
    name: 'user',
    password: 'password3'
  }
]
const nonExixtingId = async () => {
  const blog = new Blog({ title: 'Sachin Tendulkar' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExixtingId, blogsInDb, usersInDb
}