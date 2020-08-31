const express = require(`express`)
const app = express()
const port = 3000
const indexRouter = require(`./routers/index.js`)

//Body parser
app.use(express.json())
app.use(express.urlencoded({extended:false  }))

app.use(`/`,indexRouter)

app.listen(port,()=>{
    console.log(`Express running at port:${port}`)
})