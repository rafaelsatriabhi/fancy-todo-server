const express = require(`express`)
const Controller = require("../controllers/controllers")
const router = express.Router()


router.post(`/register`,Controller.postRegister)
router.post(`/login`, Controller.postLogin)

module.exports = router