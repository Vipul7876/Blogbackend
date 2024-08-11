require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const CORS = require( 'cors' );
const Router = require( './Routes/Route' );
const Connection = require( './Models/Database' );

// Middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://blogg01.netlify.app",
  "https://66b84774b696fb00081531c7--blogg01.netlify.app",
];

const corsOptions = {
  origin: function ( origin, callback ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if ( !origin ) return callback( null, true );

    if ( allowedOrigins.indexOf( origin ) !== -1 ) {
      callback( null, true ); // If the origin is in the list, allow the request
    } else {
      callback( new Error( "Not allowed by CORS" ) ); // If the origin is not in the list, block the request
    }
  },
  methods: "GET,POST,PATCH,PUT,DELETE,HEAD",
  credentials: true,
  exposedHeaders: [ 'Authorization' ],
};

app.use( CORS( corsOptions ) );

app.use( express.json() );

app.use( '/', Router );

Connection().then( () => {
  app.listen( process.env.PORT, () => {
    console.log( 'Server is Running on PORT: ' + process.env.PORT );
  } );
} );


