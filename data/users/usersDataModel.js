const db = require("../dbConfig.js");

module.exports = {
    add,
    findBy,
    get
}

function add(user) {
    return db("users").insert(user);
}

function findBy(user){
    return db("users")
    .where({"username": user.username})
}

function get() {
    return db("users");
}