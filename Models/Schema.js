const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema( {
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
} );

const User = new mongoose.model( 'user', Schema );
module.exports = User;