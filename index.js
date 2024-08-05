require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const CORS = require( 'cors' );
const Router = require( './Routes/Route' );
const Connection = require( './Models/Database' );

// Middleware
const corsoptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PATCH,PUT,DELETE,HEAD",
  credentials: true,
  exposedHeaders: [ 'Authorization' ],
};

app.use( CORS( corsoptions ) );

app.use( express.json() );

app.use( '/', Router );

Connection().then( () => {
  app.listen( process.env.PORT, () => {
    console.log( 'Server is Running on PORT: ' + process.env.PORT );
  } );
} );


