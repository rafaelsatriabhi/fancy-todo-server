const { Todo } = require(`../models`)

function authorization (req,res,next) {
    Todo.findOne({
      where:{
        id: req.params.id
      }
    })
    .then(data=>{
      if(data){
        if(data.UserId === req.loggedInUser.id){
          next()
        } else {
          res.status(401).json({
            message: 'Unauthorzied'
          })
        }
      } else{
        res.status(404).json({
          message: 'not found error: 404'
        })
      }
    })
    .catch(err=>{
      next(err)
    })
}


module.exports = authorization