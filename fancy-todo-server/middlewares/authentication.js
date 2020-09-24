const jwt = require('jsonwebtoken')

function authentication (req, res, next) {
  if(req.headers.token) {
    try{
      const payload = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
      req.loggedInUser = payload
      next()
    }
    catch(err) {
      res.status(401).json({
        message: "Failed to authenticate"
      })
    }
  } else {
    res.status(401).json({
      message: "Failed to authenticate"
    })
  }
}

module.exports = authentication