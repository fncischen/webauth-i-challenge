const bcrypt = require("bcryptjs");
const express = require("express");
const server = express();

const db = require("../dev.sqlite3");
const Users = require("../data/usersDataModel.js");

// https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account

server.use(express.json());

server.post("/api/register", (req,res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);

    // use hash to override the password
    credentials.password = hash;

    // questions about hash 
    Users.add(credentials)
        .then(saved => {
            
        })
        .catch(error => {

        })

})

server.post("/api/login", (req,res) => {

    const credentials = req.body;
    // or let {username, password} = req.body
    const hash = bcrypt.hashSync(credentials.password, 14);


    Users.findBy({ credentials }).first().then(
        user => {
            if(user && bcrypt.compareSync(credientals.password, user.password)) 
            {

                // send to header authorization 
                res.cookie()
                res.status().json({message: `Welcome ${credentials.username}`})
            }
            else {
                res.status(401).json({message: 'Invalid Credentials'});
            }
        }
    )
    .catch(error => {
        res.status(500).json(error)
    })
    
})

// restrict access to this endpoint to users that only provide the right credentials in the headers
// https://flaviocopes.com/express-headers/
server.get("/api/users", restricted, roles(['sales', 'marketing',]) (req,res) => {
    if(!req.headers.username) {
        return res.status(401).json({errorMessage: "You need to be logged in to access these users"})
    }
    else(
        Users.Get()
            .then( users => res.status(200).json())
            .catch() 
    )
})

function restricted(req, res, next) {
    const {username, password} = req.headers;

    if (username && password) {

    Users.findBy({username})
    .first()
    .then(user => {
        if(username && bcrypt.compareSync(password,user.password)){
            next();
        }
        else{
            res.status(200).json()
        }   
    })
    .catch( error => {

    }
    )
    }
    else {
        res.status(401).json({})
    }
}