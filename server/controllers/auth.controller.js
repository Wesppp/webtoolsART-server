const authService = require('../services/auth.service')

exports.register = async function(req, res) {
  try {
    const JWTUser = await authService.register(req.body)
    res.status(200).json(JWTUser)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.login = async function(req, res) {
  try {
    const JWTUser = await authService.login(req.body)
    res.status(200).json(JWTUser)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.confirmation = async function(req, res) {
  try {
    await authService.confirmation(req.params.token)
    res.redirect('http://localhost:4200/login')
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}