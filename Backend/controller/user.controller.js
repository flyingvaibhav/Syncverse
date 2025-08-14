import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
    try {
// asked name  password confirm password from the user
      const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already registered" });
    }
    // Hashing the password
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      fullname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User created successfully",   
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      });
    }
  } 
  
  catch (error) {
    console.log("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const login = async (req, res) => {
    try{
    const { email, password } = req.body;

/// compare the password and decrypt them
    const user = await User.findOne({ email });
  const isMatch = user && await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(404).json({ message: "Invalid Username or password" });
    }
    createTokenAndSaveCookie(res, user._id);
    res.status(200).json({ message: "Login successful", 
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
 });
 }
    catch (error) {
        console.log("Error during login:", error);
         res.status(500).json({ message: "Internal server error" });
      }
};

// logout the user
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
