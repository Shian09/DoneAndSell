const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { jwtKey } = require("../keys");

module.exports = (req, res, next) => {
  // console.log("in require auth body: ", req.body);
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwtKey, (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }
    req.user = payload;
    next();
  });
};
