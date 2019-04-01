const bcrypt = require("bcryptjs");
const express = require("express");
const server = express();

const Users = require("../data/users/usersDataModel.js");

// https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account
// https://medium.com/@paulrohan/how-bcryptjs-works-90ef4cb85bf4
server.use(express.json());

server.post("/api/register", (req,res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);

    // use hash to override the password
    credentials.password = hash;

    // questions about hash 
    Users.add(user)
        .then(saved => {
            res.status(200).json(saved);
        })
        .catch(error => {
            res.status(500).json({errorMessage: "There was an error in registering your user."})
        })

})

server.post("/api/login", (req,res) => {

    let {username, password} = req.body;
    // or let {username, password} = req.body
    const hash = bcrypt.hashSync(user.password, 14);


    Users.findBy({ user }).first().then(
        user => {
            if(user && bcrypt.compareSync(password, user.password)) 
            {
                res.status(200).json({message: `Welcome ${user}`})
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
server.get("/api/users", restricted,(req,res) => {
    Users.get()
         .then( users => res.status(200).json())
         .catch() 
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