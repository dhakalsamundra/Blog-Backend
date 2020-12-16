const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accu, curr) => accu + curr.likes, 0) || 0
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((accu, curr) => curr.likes > accu.likes ? curr : accu)
  const { id, url, ...favBlog3 } = favBlog
  // below return only return the property except id and url.
  return favBlog3
}

const mostBlogs = (blogs) => {
  const ManyBlogsAuthor = _
    .chain(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .sortBy('blogs')
    .last()
    .value()
  return ManyBlogsAuthor
}

const mostLikes = (blogs) => {
  const HighestLikedAuthor = _
    .chain(blogs)
    .groupBy('author')
    .map((obj, key) => ({ 'author': key, 'likes': _.sumBy(obj, 'likes') }))
    .sortBy('likes')
    .last()
    .value()
  return HighestLikedAuthor
}
module.exports =  {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}