const user = require( '../Models/Schema' );
const blogSchema = require( '../Models/BlogSchema' );

const crypto = require( 'crypto' );


const home = async ( req, res ) => {
  try {
    const allBlogs = await blogSchema.find();

    res
      .status( 200 )
      .json( allBlogs );
  }
  catch ( error ) {
    res
      .status( 400 )
      .send( error );
  }
};

const signup = async ( req, res ) => {
  try {
    const { username, password } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User already Exist!' } );
    }

    const userCreated = await user.create( {
      username,
      password,
    } );

    res
      .status( 201 )
      .json( {
        status: 'success',
        User: {
          username: await userCreated.username,
          id: await userCreated._id.toString(),
        }
      } );


  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );
  }

};


const login = async ( req, res ) => {
  try {
    const { username, password } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }


    if ( UserExist.password == password ) {
      res
        .status( 200 )
        .json( {
          status: 'success',
          User: {
            username: await UserExist.username,
            id: await UserExist._id.toString(),
          }
        } );
    } else {
      res
        .status( 401 )
        .json( { status: 'unsuccess' } );
    }
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }

};

const userBlogs = async ( req, res ) => {
  try {
    const username = req?.params?.username;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const blogs = await blogSchema.find( { username } );

    res
      .status( 201 )
      .json( blogs );

  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }
};

const addBlog = async ( req, res ) => {
  try {
    const { username, title, blog } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const generateId = ( size ) => crypto.randomBytes( size ).toString( 'hex' ).substring( 0, size );
    const size = 6; // Desired length of the ID
    const blogId = generateId( size );

    const addedBlog = await blogSchema.create( {
      username,
      title,
      blog,
      blogId
    } );

    res
      .status( 201 )
      .json( {
        status: 'success',
      } );
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }

};

const updateBlog = async ( req, res ) => {
  try {
    const { blogId, username, title, blog } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const updatedBlog = await blogSchema.findOneAndUpdate( { blogId }, {  username, title, blog }, { returnOriginal: false } );

    res
      .status( 201 )
      .json( {
        status: 'success',
      } );
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }

};
const deleteBlog = async ( req, res ) => {
  try {
    const { blogId, username } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const deletedBlog = await blogSchema.findOneAndDelete( { blogId } );

    res
      .status( 201 )
      .json( {
        status: 'success',
      } );
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }

};

module.exports = {
  home,
  login,
  signup,
  addBlog,
  userBlogs,
  updateBlog,
  deleteBlog
};