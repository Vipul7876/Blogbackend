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
  .route( '/blog/update' )
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

Router
  .route( '/users_list/delete' )
  .post( Controller.deleteUser );

Router
  .route( '/account' )
  .post( Controller.addBio );

Router
  .route( '/account/bio' )
  .post( Controller.getBio );

Router
  .route( '/account/delete' )
  .post( Controller.deleteUser );


module.exports = Router;