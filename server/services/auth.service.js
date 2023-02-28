const AppError = require('../utils/appError')
const User = require('../models/users.model')

exports.register = async function(reqBody) {
  try {
    const isExistingEmail = !!await User.findOne({email: reqBody.email})
    const isExistingUsername = !!await User.findOne({username: reqBody.username})

    if (isExistingEmail) { throw new AppError('The email address you have entered is already associated with another account.', 401) }
    if (isExistingUsername) { throw new AppError('The username you have entered is already associated with another account.', 401) }
  
    const newUser = new User(reqBody)
    await newUser.save()

    return {token: newUser.generateJWT(), user: newUser}
  } catch(err) {
    throw err
  }
}

exports.login = async function(reqBody) {
  try {
    const user = await User.findOne({email: reqBody.email})

    if (!user) { throw new AppError(`The email address ${reqBody.email} is not associated with any account`, 401) }
  
    if(!user.comparePassword(reqBody.password)) { throw new AppError('Invalid email or password', 401) }
  
    return {token: user.generateJWT(), user: user}
  } catch (err) {
    throw err
  }
}