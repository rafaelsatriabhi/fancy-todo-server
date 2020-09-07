if(process.env.NODE_ENV === "development"){
    require("dotenv").config()
}

const express = require(`express`)
require(`dotenv`).config()
const app = express()
const cors = require('cors')
const port = 3001
const indexRouter = require(`./routers/index.js`)

//Body parser
app.use(express.json())
app.use(express.urlencoded({extended:false  }))
app.use(cors())


app.use(`/`,indexRouter)

app.listen(port,()=>{
    console.log(`Express running at port:${port}`)
})