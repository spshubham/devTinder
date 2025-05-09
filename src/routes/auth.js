const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while creating user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Creds");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token,{expires : new Date(Date.now()+8*3600000)});
      res.status(200).send("Login Success");
    } else {
      throw new Error("Incorrect creds");
    }
  } catch (err) {
    res.status(400).send("Error while logging in " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
   res.cookie("token",null,{expires : new Date(Date.now())});
   res.send("Logged Out");
  } catch (err) {
    res.status(400).send("Error while logging in " + err.message);
  }
});
module.exports = authRouter;
