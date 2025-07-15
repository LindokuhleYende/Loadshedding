//Protects routes using JWT — it checks if the token is valid before allowing access.

const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
require("dotenv").config();

//This is your JWT gatekeeper — called when the frontend wants to check if the user is logged in.
module.exports.userVerification = (req, res) => {
  const token = req.cookies.token; //It looks for the JWT token stored in the user’s cookies.
  if (!token) return res.json({ status: false });//If there’s no token, the user is not logged in.
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) return res.json({ status: false }); //if invalid token, return false
    const user = await User.findById(data.id); //This step ensures that the user ID in the token actually exists in your database.
    if (user) return res.json({ status: true, user: user.username });
    else return res.json({ status: false });
  });
};

