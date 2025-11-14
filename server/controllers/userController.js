import { generateToken } from "../lib/utils";
import User from "../models/User";
import bycrpt from "bycryptjs";



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

        const salt = await bycrpt.genSalt(10);
        const hashedPassword = await bycrpt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password, hashedPassword, bio
        });

        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, token, message:"Account created succesfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Controller to login a user

export const login = async (req,res)=>{

    try {

        const {email, password} = req.body;
        const userData = await User.findOne({email});

        if(!userData){
            res.json({sucess: false, message:"Email Id does not exist"});
        }

        const isPasswordCorrect = await bycrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            res.json({sucess: false, message:"Invalid Credentials"});
        }

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message:"Login Succesful"})



    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Controller to check if user is authenticated
export const checkAuth = (req,res) =>{
    res.json({success: true, user: req.user});
}

//Controller to update user profile details