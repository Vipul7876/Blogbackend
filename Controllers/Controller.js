const user = require( '../Models/Schema' );
const blogSchema = require( '../Models/BlogSchema' );
const adminSchema = require( '../Models/AdminSchema' );
const crypto = require( 'crypto' );// For BlogId
const jwt = require( 'jsonwebtoken' );// For Authentication
const bcrypt = require( 'bcryptjs' );// For Password Hashig

async function hashPassword ( password ) {
  const saltRounds = 10; // Adjust the number of salt rounds for increased security
  const hashedPassword = await bcrypt.hash( password, saltRounds );
  return hashedPassword;
}

async function verifyPassword ( password, hashedPassword ) {
  const match = await bcrypt.compare( password, hashedPassword );
  return match;
}

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

    const hashedPassword = hashPassword( password );

    const userCreated = await user.create( {
      username: username,
      password: await hashedPassword,
    } );

    res.setHeader( 'Authorization', `Bearer ${ await userCreated.generateToken() }` );

    res
      .status( 201 )
      .json( {
        status: 'success',
        User: {
          username: await userCreated.username,
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

    const isVerified = await verifyPassword( password, UserExist?.password );

    if ( isVerified ) {
      res.setHeader( 'Authorization', `Bearer ${ await UserExist.generateToken() }` );

      res
        .status( 200 )
        .json( {
          status: 'success',
          User: {
            username: await UserExist?.username,
            bio: await UserExist?.bio
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
    const { username, title, blog, description } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const generateId = ( size ) => crypto.randomBytes( size ).toString( 'hex' ).substring( 0, size );
    const size = 6; // Desired length of the ID
    const blogId = generateId( size );

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are zero-indexed
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const timeDate = `${ hours }:${ minutes } ${ day }/${ month }/${ year }`;

    const addedBlog = await blogSchema.create( {
      username,
      title,
      blog,
      blogId,
      description,
      timeDate,
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
    const { blogId, username, title, blog, description } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const updatedBlog = await blogSchema.findOneAndUpdate( { blogId }, { username, title, blog, description }, { returnOriginal: false } );

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

const LoginInfo = async ( req, res ) => {
  try {
    const { authorization } = req.headers;

    const token = authorization?.split( ' ' )[ 1 ];

    const verified = jwt.verify( token, process.env.SECRET_KEY );
    const userdata = await user.findOne( { username: verified.username } );

    res.json( {
      status: 'success',
      User: {
        username: await userdata?.username,
        bio: await userdata?.bio,

      }
    } );

  } catch ( error ) {
    res
      .status( 400 )
      .send( error );
  }
};

const admin = async ( req, res ) => {
  try {
    const { username, password } = req.body;

    const UserExist = await adminSchema.findOne( { username } );
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

const deleteUser = async ( req, res ) => {
  try {
    const { username } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const deleteduser = await user.findOneAndDelete( { username } );

    res
      .status( 201 )
      .json( {
        status: 'success',
        User: deleteduser?.username,
      } );
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }
};

const allUsers = async ( req, res ) => {
  try {

    const List = await user.find();

    res
      .status( 200 )
      .json( List );

  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }
};

const addBio = async ( req, res ) => {
  try {
    const { username, bio } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    const updatedUser = await user.findOneAndUpdate( { username }, { bio }, { returnOriginal: false } );

    res
      .status( 201 )
      .json( {
        status: 'success',
        username: await updatedUser?.username,
        bio: await updatedUser?.bio,
      } );
  } catch ( error ) {
    res
      .status( 400 );
    console.log( error );

  }
};

const getBio = async ( req, res ) => {
  try {
    const { username } = req.body;

    const UserExist = await user.findOne( { username } );
    if ( !UserExist ) {
      return res.status( 400 ).json( { status: 'unsuccess', message: 'User does not Exist!' } );
    }

    res
      .status( 201 )
      .json( {
        status: 'success',
        username: await UserExist?.username,
        bio: await UserExist?.bio,
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
  deleteBlog,
  LoginInfo,
  admin,
  allUsers,
  deleteUser,
  addBio,
  getBio
};