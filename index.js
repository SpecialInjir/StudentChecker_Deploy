const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000



app.get("/",(req, res)=>{
    res.end("<div>Happe me</div>")
})

app.listen(PORT, ()=>{
    console.log("Server has been started!!!!")
})
