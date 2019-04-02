const express = require("express");
const server = express();

const userServer = require("./auth/server.js");
const session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);

// place in development environment through server
const serverConfig = {
    name: "notsession", 
    secret: "Gives us access to users",
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 5,
        secure: true,
        httpOnly: true, 
    },
    httpOnly: true, 
    resave: false,
    saveUnitialized: false,
    store: new KnexSessionStore({
         knex: require('./data/dbConfig.js'),
         tablename: "sessions",
         sidfieldname: "sid",
         createtable: true
        }) 
}
// this sessionConfig is stored in server

server.use(express.json());
server.use(session(serverConfig));
server.use("/api", userServer); 


server.listen(5000, () => {console.log(
    "You are now in http://localhost:5000/!"
)})