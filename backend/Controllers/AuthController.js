//Handles the logic for signup/login. This is where JWTs are created and sent to the client.

const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

//This function runs when a user submits the signup form.
module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body; //Get the submitted form data.
    //Check if this email is already registered.
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });
    const user = await User.create({ email, password, username });
    const token = createSecretToken(user._id); //calls create function from util/SecretToken.js to create a JWT token.
    res.cookie("token", token, { withCredentials: true, httpOnly: false }); //Sends the JWT to the browser as a cookie.
    res.status(201).json({ message: "User signed in successfully", success: true, user }); //Returns success and the user info.

    next();
  } catch (error) {
    console.error(error);
  }
};

//When a user tries to log in, this function handles it.
module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ message: 'All fields are required' }); //Check if both fields were filled.
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'Incorrect password or email' }); //Looks for the user in the DB.
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.json({ message: 'Incorrect password or email' }); //Compare the entered password with the hashed password.

    const token = createSecretToken(user._id, user.isAdmin);

    res.cookie("token", token, { withCredentials: true, httpOnly: false }); //Sends the JWT to the browser as a cookie.
    res.status(201).json({
      message: "User logged in successfully", success: true,
      token, // ✅ Send the token back in the response body
      user: {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
    next();
  } catch (error) {
    console.error(error);
  }
};
