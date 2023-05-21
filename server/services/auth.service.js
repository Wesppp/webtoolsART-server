require('dotenv').config({path: __dirname + '../.env'});
const AppError = require('../utils/appError')
const User = require('../models/users.model')
const jwt = require('jsonwebtoken');
const emailConfirmation = require('../utils/emailConfirmation')

const { JWT_SECRET } = process.env

exports.register = async function(reqBody) {
  try {
    const newUser = new User(reqBody)
    await newUser.save()

    emailConfirmation.sendConfirmationEmail(newUser)

    return {token: newUser.generateJWT(), user: newUser}
  } catch(err) {
    if (err.code === 11000 && err.keyPattern.username) {
      err.message = 'This username is already used!';
    } else if (err.code === 11000 && err.keyPattern.email) {
      err.message = 'This email is already used!';
    }
    throw err
  }
}

exports.login = async function(reqBody) {
  try {
    const user = await User.findOne({email: reqBody.email})

    if (!user) { throw new AppError(`The email address ${reqBody.email} is not associated with any account`, 401) }
    if(!user.comparePassword(reqBody.password)) { throw new AppError('Invalid email or password', 401) }
    if (!user.isConfirmed) { throw new AppError('Confirm your email account!', 400) } 
  
    return {token: user.generateJWT(), user: user}
  } catch (err) {
    throw err
  }
}

exports.confirmation = async function(token) {
  try {
    const { userId } = (jwt.verify(token, JWT_SECRET))
    await User.findOneAndUpdate({_id: userId}, {isConfirmed: true})
  } catch(err) {
    throw err
  }
}