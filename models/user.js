import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        default: "client",
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    }
});

const USER = mongoose.model("member", userSchema);
export default USER;