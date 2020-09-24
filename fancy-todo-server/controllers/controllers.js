const {Todo,User} = require(`../models/index.js`)
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)

class Controller{
    static postTodos(req,res,next) {
        Todo.create({
            title: req.body.title,
            description: req.body.description,
            status: "Belum terealisasi",
            due_date: req.body.due_date,
            UserId: req.loggedInUser.id
        })
        .then((data)=>{
           res.status(201).json(data)
        })
        .catch((err)=>{
            next(err)
        })
    }
    static getTodos(req,res,next){        
        Todo.findAll({
            where: {
                UserId: req.loggedInUser.id
            },
            include: [
                User
            ],
            order: [['id','ASC']]
        }) 
        .then((data)=>{
            res.status(200).json(data)
        })
        .catch((err)=>{
            next(err)
        })
    }
    static getTodosById(req,res,next) {
        Todo.findAll({
            where:{
                id: req.params.id
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
            next(err)
        })
    }
    static putTodosById(req,res,next){
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
                    next(err)
                })
            }
            else{
                res.status(404).json({
                    errors: ["Not found error"]
                })
            }
        })
        .catch((err)=>{
            next(err)
        })
    }
    static deleteTodosById(req,res,next){
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
                   next(err)
                })
            }
        })
        .catch((err)=>{
            next(err)
        })
    }
    static postRegister(req,res,next) {
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
            next(err)
        })
    }
    static postLogin(req,res,next){
        User.findOne({
            where:{
                email:req.body.email
            }
        })
        .then((data)=>{
            if(data){
                if (bcrypt.compareSync(req.body.password,data.password)){
                    const payload = {id: data.id,email: data.email}
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
            next(err)
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