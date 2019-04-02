const bcrypt = require("bcryptjs");
const router = require("express").Router();


const Users = require("../data/users/usersDataModel.js");

// https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account
// https://medium.com/@paulrohan/how-bcryptjs-works-90ef4cb85bf4

router.post("/register", (req,res) => {
    console.log(req.body + " at line 10");
    console.log("Trying to register!");
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);

    // use hash to override the password
    user.password = hash;

    // questions about hash 
    Users.add(user)
        .then(saved => {
            res.status(200).json(saved);
        })
        .catch(error => {
            res.status(500).json({errorMessage: "There was an error in registering your user."})
        })

})

router.post("/login", (req,res) => {

    let {username, password} = req.body;
    // or let {username, password} = req.body
    const hash = bcrypt.hashSync(password, 14);

    let user = {
        "username": username,
        "password": hash
    }

    Users.findBy(user).first().then(
        a_user => {
            console.log("User password: " + user.password);
            console.log("Retrieved database password " + a_user.password);
            if(user && bcrypt.compareSync(user.password, a_user.password)) 
            {
                res.header.authorization = 
                res.status(200).json({message: `Welcome ${a_user}`})
            }
            else {
                res.status(401).json({message: 'Invalid Credentials'});
            }
        }
    )
    .catch(error => {
        res.status(500).json({errorMessage: "We had trouble retrieving the user you wanted."})
    })
    
})

// restrict access to this endpoint to users that only provide the right credentials in the headers
// https://flaviocopes.com/express-headers/
router.get("/users", restricted,(req,res) => {
    Users.get()
         .then( users => res.status(200).json(users))
         .catch(error => res.status(500).json({errorMessage: "We could not retrieve user data."}) ) 
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
            return res.status(401).json({message: "This area is restricted to registered users!"})
        }   
    })
    .catch( error => {
        res.status(500).json({errorMessage: "There was an error in accessing the restricted area."})
    })
    }
    else {
        res.status(500).json({errorMessage: "There was an error in making the server request."})
    }
}

module.exports = router; 