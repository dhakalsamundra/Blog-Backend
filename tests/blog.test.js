const listHelper = require('../utils/list_helper')
const _ = require('lodash')

const listWithZeroBlogs = [
  {}
]

const listWithOneBlogs = [
  {
    title: 'Murphy Law Defination',
    kauthor: 'Samundra',
    url: 'https://en.wikipedia.org/wiki/Murphy%27s_law',
    likes: 20,
    id: '5e98061c84cc120a0d6d7fad'
  }
]

const listWithManyBlogs = [
  {
    title: 'Murphy Law Defination',
    author: 'Samundra',
    url: 'https://en.wikipedia.org/wiki/Murphy%27s_law',
    likes: 20,
    id: '5e98061c84cc120a0d6d7fad'
  },
  {
    title: 'Featuring the HomeSense',
    author: 'Sandhya',
    url: 'https://www.capturebylucy.com/blog',
    likes: 120,
    id: '5e980aa937dbb30b51ce6e27'
  },
  {
    title: 'Interior Designing',
    author: 'Sandesh',
    url: 'https://www.thegoodtrade.com/',
    likes: 140,
    id: '5e980af337dbb30b51ce6e28'
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    id: '5e9825155bb9db121455fb0c'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    id: '5e9825335bb9db121455fb0d'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    id: '5e9825475bb9db121455fb0e'
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    id: '5e98255a5bb9db121455fb0f'
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    id: '5e9825685bb9db121455fb10'
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    id: '5e9825715bb9db121455fb11'
  }
]



// testing the dummy
test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
//testing the totalLikes function
describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithZeroBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlogs)
    expect(result).toBe(20)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(316)
  })
})

// testing the favoriteBlog function
describe('which blog has most likes', () => {
  test('of empty list with zero blogs', () => {
    const result = listHelper.favoriteBlog(listWithZeroBlogs)
    const expected = {}
    expect(result).toEqual(expected)
  })
  test('of many blogs', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    const expected =  {
      title: 'Interior Designing',
      author: 'Sandesh',
      likes: 140
    }
    expect(result).toEqual(expected)
  })
})

// testing for the mostBlogs function
test('author with most blogs', () => {
  const result = listHelper.mostBlogs(listWithManyBlogs)
  const expected = { author: 'Robert C. Martin', blogs: 3 }
  expect(result).toEqual(expected)
})

//testing the mostLikes function
test('author with most likes', () => {
  const result = listHelper.mostLikes(listWithManyBlogs)
  const expected = {
    author: 'Sandesh',
    likes: 140
  }
  expect(result).toEqual(expected)
})