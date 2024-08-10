const mongoose = require( 'mongoose' );

const Connection = async () => {
  try {
    await mongoose.connect( `${process.env.MONGODB_URL}/blogg` );
    console.log( 'Database Connected!' );
  } catch ( error ) {
    console.log( 'Connection Error:' + error );
    process.exit( 1 );
  }
};

module.exports = Connection;