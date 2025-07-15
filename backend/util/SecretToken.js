//contains the JWT secret or a helper to sign/verify tokens.
//The token is sent to the browser and then sent back with every protected request.

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createSecretToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.TOKEN_KEY, {
    expiresIn: "3d",
  });
};