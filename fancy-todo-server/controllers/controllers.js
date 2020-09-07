const {Todo,User} = require(`../models/index.js`)
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)

class Controller{
    static postTodos(req,res){
        Todo.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            UserId:req.body.UserId
        })
        .then((data)=>{
           res.status(201).json(data)
        })
        .catch((err)=>{
            if(err.errors[0].type === `Validation error`){
                res.status(400).json({
                    errors: err.errors
                })
            }
            else{
                res.status(500).json({
                    errors: ["Internal server error"]
                })
            }
        })
    }
    static getTodos(req,res){

        if(!req.headers.token){
            res.status(401).json({
                message:"Authentication Fail"
            })
        }
        else{
            try{
                const verified = jwt.verify(req.headers.token,process.env.JWT_SECRET_KEY)
                Todo.findAll({
                    include: [
                        User
                    ]
                }) 
                .then((data)=>{
                    res.status(200).json(data)
                })
                .catch(()=>{
                    res.status(500).json({
                        errors:  ["Internal server error"]
                    })
                })
            } catch{
                res.status(401).json({
                    message:"Authentication Fail"
                })
            }       
        }
    }
    static getTodosById(req,res){
        Todo.findAll({
            where:{
                UserId:req.params.id
            }
        })
        .then((data)=>{
            if(data.length === 0){
                res.status(404).json({
                    errors: [`error not found`]
                })
            }
            else{
                res.status(200).json(data)
            }
        })
        .catch((err)=>{
            res.status(500).json({
                errors: ["internal server error"]
            })
        })
    }
    static putTodosById(req,res){
        Todo.findOne({
            where:{
                id:req.params.id
            }
        })
        .then((data)=>{
            if(data){
                Todo.update({
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    due_date: req.body.due_date
                },{
                    where:{
                        id: req.params.id
                    }
                })
                .then(()=>{
                    res.status(200).json({
                        message:["Data berhasil diperbaharui"]
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        errors: err
                        // errors: [`Bad Request`]
                    })
                })
            }
            else{
                res.status(404).json({
                    errors: ["Not found error"]
                })
            }
        })
        .catch((err)=>{
            res.status(500).json({
            message: ["Internal server error"]
            })
        })
    }
    static deleteTodosById(req,res){
        Todo.findOne({
            where:{
                id:req.params.id
            }
        })
        .then((data)=>{
            if(!data){
                res.status(404).json({
                    errors: ["Not found error"]
                })
            }
            else{
                Todo.destroy({
                    where:{
                        id:req.params.id
                    }
                })
                .then(()=>{
                    res.status(200).json({
                        message: ["Todos berhasil dihapus"]
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        errors: err.errors
                    })
                })
            }
        })
        .catch(()=>{
            res.status(500).json({
                    errors: ["Internal server error"]
                })
        })
    }
    static postRegister(req,res){
        let dataUser = {
            email: req.body.email,
            password: req.body.password
        }
        User.create(dataUser)
        .then((data)=>{
            res.status(201).json({
                id:data.id,
                email:data.email,
                message:"Pendaftaran berhasil"
            })
        })
        .catch((err)=>{
            if(err.errors[0].message === "email must be unique"){
                res.status(400).json({
                    message: err.errors[0].message    
                })
            }
            else{
                res.status(500).json({
                    message:["Internal Server Error"]
                })
            }
        })
    }
    static postLogin(req,res){
        User.findOne({
            where:{
                email:req.body.email
            }
        })
        .then((data)=>{
            if(data){
                if(bcrypt.compareSync(req.body.password,data.password)){
                    const payload = {email:data.email}
                    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY)
                    res.json({
                        token:token
                    })
                }
                else{
                    res.status(400).json({
                        message: "Invalid email/password"
                    })
                }  
            }
            else{
                res.status(400).json({
                    message: "Invalid email/password"
                })
            }  
        })
        .catch((err)=>{
            res.send(err)
        })
    }
    static googleLoginHandler(req, res, next) {
        let payload;
        gClient.verifyIdToken({
          idToken: req.body.id_token,
          audience: process.env.google_oauth_clientId
        })
          .then((ticket) => {
            payload = ticket.getPayload();
            return User.findOne({ where: { email: payload.email } })
          })
          .then((data) => {
            if (data === null) {
              return User.create({
                name: payload.name,
                email: payload.email,
                password: `${payload.name}`
              })
            } else {
              return data;
            }
          })
          .then(() => {
            let frontendPayload = {
              name: payload.name,
              email: payload.email
            }
            let token = jwt.sign(frontendPayload, process.env.JWT_SECRET_KEY)
            res.status(200).json({ token })
          })
          .catch(() => {
            res.status(400).json({
              message: "Invalid email/password"
            })
          })
    
      }
}

module.exports = Controller