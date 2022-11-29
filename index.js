const port = process.env.PORT || 3000
const express = require('express');
const path = require('path')
const app = express()
const apiRoute = require("./routes/api")



app.use("/", express.static(path.join(__dirname, 'public')))
app.use("/api", apiRoute)


app.listen(port, ()=>{
    console.log('algo foi')
})

