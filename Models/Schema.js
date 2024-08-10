const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

const Schema = mongoose.Schema( {
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  bio: {
    type: String,
    require: true
  },
} );


Schema.methods.generateToken = async function () {
  try {
    return jwt.sign( {
      username: this.username,
    },
      process.env.SECRET_KEY, {
        expiresIn:'30d',
      }
    );
  } catch ( error ) {
    console.error( error );
  }
};


const User = new mongoose.model( 'user', Schema );


module.exports = User;