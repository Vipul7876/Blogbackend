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

const Admin = new mongoose.model( 'admin', Schema );


module.exports = Admin;