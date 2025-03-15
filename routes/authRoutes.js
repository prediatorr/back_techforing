import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {

    const emailExist = await User.findOne({email:req.body.email});

    if(emailExist){
      return res.status(400).json({message:'This Email already exist'})
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({message:'user registration successfull.'});
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      res.json({ token: accessToken });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
