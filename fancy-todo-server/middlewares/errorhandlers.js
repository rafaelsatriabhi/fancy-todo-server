function errorhandler (err,req,res,next) {
  let errors = []
  let statusCode = 500
  switch (err.name) {
    case "SequelizeValidationError":
      err.errors.forEach((el)=>{
        errors.push(el.message)
      })
      statusCode = 400
      break;
    case "SequelizeUniqueConstraintError":
      err.errors.forEach((el)=>{
        errors.push(el.message)
      })
      statusCode = 400
      break;
    default:
      errors.push('Internal Server Error')
      break;
  }
  res.status(statusCode).json({errors})
}

module.exports = errorhandler