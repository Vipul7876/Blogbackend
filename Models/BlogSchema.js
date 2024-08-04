const mongoose = require( 'mongoose' );

const BlogSchema = mongoose.Schema( {
  username: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  blog: {
    type: String,
    require: true,
  },
  blogId: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  timeDate: {
    type: String,
    require: true,
  },
} );

const blog = new mongoose.model( 'blog', BlogSchema );

module.exports = blog;