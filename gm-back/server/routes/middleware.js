const db = require("../models");
const User = db.user;
const jwt= require('jsonwebtoken');

verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token:", token);
  if (token == null) return res.status(401).send("No token provided");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({"message":"The access token is not valid"}); 
    req.user = user;
    console.log(req.user);
    next();
  });
};

module.exports=verifyToken