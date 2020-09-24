const express = require(`express`)
const Controller = require("../controllers/controllers")
const router = express.Router()

router.post(`/`,Controller.postTodos)
router.get(`/`,Controller.getTodos)
router.get(`/:id`,Controller.getTodosById)
router.put(`/:id`,Controller.putTodosById)
router.delete(`/:id`,Controller.deleteTodosById)

module.exports = router