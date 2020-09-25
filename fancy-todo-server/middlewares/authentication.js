const jwt = require('jsonwebtoken')

const { User } = require('../models')

function authentication (req, res, next) {
  if(req.headers.token) {
    try{
      const payload = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)

      User.findOne({ //cek apakah usernya masih ada atau enggak di database
        where: {
          id: payload.id
        }
      })
      .then(data=>{
        if(data){
          req.loggedInUser = payload
          next()
        } else {
          res.status(401).json({
            message: "Failed to authenticate"
          })
        }
      })
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