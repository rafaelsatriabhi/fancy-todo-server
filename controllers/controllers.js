const {Todo,User} = require(`../models/index.js`)

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
        Todo.findAll({
            include: [
                User
            ]
        }) 
        .then((data)=>{
            res.status(200).json(data)
        })
        .catch((err)=>{
            res.status(500).json({
                errors:  ["Internal server error"]
            })
        })
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
                errors: ["Internal server error"]
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
                        errors: [`Bad Request`]
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
                .cathc((err)=>{
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
            res.send(err)
            res.status(500).json({
                message:["Internal Server Error"]
            })
        })
    }
    static postLogin(req,res){
        
    }
}

module.exports = Controller