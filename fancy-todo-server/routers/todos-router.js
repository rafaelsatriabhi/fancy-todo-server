const express = require(`express`)
const Controller = require("../controllers/controllers")
const authorization = require("../middlewares/authorization")
const router = express.Router()

router.post(`/`, Controller.postTodos)
router.get(`/`, Controller.getTodos)
router.get(`/:id`, Controller.getTodosById)

router.put(`/:id`,authorization, Controller.putTodosById)
router.delete(`/:id`,authorization, Controller.deleteTodosById)

module.exports = router