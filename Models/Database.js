const mongoose = require( 'mongoose' );

const Connection = async () => {
  try {
    await mongoose.connect( process.env.DATABASE_URL );
    console.log( 'Database Connected!' );
  } catch ( error ) {
    console.log( 'Connection Error:' + error );
    process.exit( 0 );
  }
};

module.exports = Connection;