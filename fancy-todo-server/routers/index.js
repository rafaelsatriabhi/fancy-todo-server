const express = require(`express`)
const authentication = require("../middlewares/authentication")
const errorhandler = require(`../middlewares/errorhandlers`)
const router = express.Router()
const todosRouter = require(`./todos-router`)
const usersRouter = require(`./user-router`)

router.use(`/users`,usersRouter)
router.use(`/todos`,authentication ,todosRouter)

router.use(errorhandler)

module.exports = router