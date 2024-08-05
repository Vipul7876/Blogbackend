const express = require( 'express' );
const Router = express.Router();

const Controller = require( '../Controllers/Controller' );


Router
  .route( '/' )
  .get( Controller.home );

Router
  .route( '/myblogs/:username' )
  .get( Controller.userBlogs );

Router
  .route( '/login/signup' )
  .post( Controller.signup );

Router
  .route( '/login' )
  .post( Controller.login );

Router
  .route( '/myblogs' )
  .post( Controller.addBlog );

Router
  .route( '/myblogs/update' )
  .post( Controller.updateBlog );

Router
  .route( '/blog' )
  .post( Controller.deleteBlog );

Router
  .route( '/nav' )
  .post( Controller.LoginInfo );
  
Router
  .route( '/admin' )
  .post( Controller.admin );
Router
  .route( '/users_list' )
  .get( Controller.allUsers );


module.exports = Router;