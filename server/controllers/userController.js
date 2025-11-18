import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";



//Signup a user
export const signup = async (req,res)=>{
    const {fullName, email, password, bio} = req.body;

    try {

        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message:"Missing Details"});
        }

        const user = await User.findOne({email});
        if(user){   
            return res.json({success: false, message:"Account already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password, hashedPassword, bio
        });

        const token = generateToken(newUser._id);

        return res.json({success: true, userData: newUser, token, message:"Account created succesfully"})

    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

// Controller to login a user

export const login = async (req,res)=>{

    try {

        const {email, password} = req.body;
        const userData = await User.findOne({email});

        if(!userData){
            return res.json({sucess: false, message:"Email Id does not exist"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({sucess: false, message:"Invalid Credentials"});
        }

        const token = generateToken(userData._id);

        return res.json({success: true, userData, token, message:"Login Succesful"})



    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}


//Controller to check if user is authenticated
export const checkAuth = (req,res) =>{
    return res.json({success: true, user: req.user});
}

//Controller to update user profile details

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic, bio, fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName},{new:true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName, profilePic: upload.secure_url},{new:true});
        }

        return res.json({success:true, user: updatedUser});

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message});
    }
}