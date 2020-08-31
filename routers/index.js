const express = require(`express`)
const router = express.Router()
const todosRouter = require(`./todos-router`)
const usersRouter = require(`./user-router`)

router.use(`/todos`,todosRouter)
router.use(`/users`,usersRouter)


module.exports = router