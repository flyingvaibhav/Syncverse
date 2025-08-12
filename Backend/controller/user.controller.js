import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Save JWT cookie
    createTokenAndSaveCookie(res, newUser._id);

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.log("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const login = async (req, res) => {
    try{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
  const isMatch = user && await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
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
