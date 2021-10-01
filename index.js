const express = require("express")
const app = express()
const port = process.env.port || 8000



app.get("/",(req, res)=>{
    res.end("<div>Happe me</div>")
})

app.listen(port, ()=>{
    console.log("Server has been started!!!!")
})
