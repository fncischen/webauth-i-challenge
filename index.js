const express = require("express");
const server = express();

const userServer = require("./auth/server.js");

server.use(express.json());
server.use("/api", userServer); 


server.listen(5000, () => {console.log(
    "You are now in http://localhost:5000/!"
)})