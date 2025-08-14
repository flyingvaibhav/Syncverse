import mongoose from "mongoose";    
const userSchema =  mongoose.Schema({
    name: {
        type: String,    // schhema for the name
        required: true,
    },
    email: {
        type: String,
        required: true,    /// schema for the email
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,   /// schema for the password
    },
    confirmPassword: {
        type: String,
        required: true,   /// schema for the confirm password
    }

}, { timestamps: true });
    const User = mongoose.model("User", userSchema);
    export default User;