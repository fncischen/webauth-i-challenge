const express = require("express");
const server = express();

const userServer = require("./auth/server.js");
const session = require('express-session');


// place in development environment through server
const serverConfig = {
    name: "", 
    secret: "",
    cookie: {
        maxAge: ,
        secure: true,
    },
    httpOnly: true, 
    reSave: false,
    saveUnitialized: false, 
}

server.use(express.json());
server.use()
server.use("/api", userServer); 


server.listen(5000, () => {console.log(
    "You are now in http://localhost:5000/!"
)})