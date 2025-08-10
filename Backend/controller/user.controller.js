import User from "../models/user.model.js";

 export const signup = async (req, res) => {
try{
        const { name, email, password, confirmPassword } = req.body;
 if(password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
const user= await User.findOne({email});
if(user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await new User({ name, email, password});
    newUser.save()
        .then(() => res.status(201).json({ message: "User created successfully" }));
}
catch (error) {
        console.log("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
}
    }