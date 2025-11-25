import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";


//Get all users except the logged in user
export const getUsersForSidebar = async (req,res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne: userId}}).select("-password");

        //Count number of messages not seen
        const unseenMessages = {};
        const promises = filteredUsers.map(async(user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false});
            if(messages.length>0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        return res.json({success:true, users:filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

//Get all messages for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receieverId: selectedUserId },
                { senderId: selectedUserId, receieverId: myId },
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            { senderId: selectedUserId, receieverId: myId },
            { seen: true }
        );

        return res.json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};



//API to mark message as seen using message id

export const markMessagesAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true});
        return res.json({success:true});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}


//Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        const newMessage = await Message.create({
            senderId,
            receieverId: receiverId,
            text,
            image
        });

        // SEND TO RECEIVER
        if (userSocketMap[receiverId]) {
            io.to(receiverId).emit("newMessage", newMessage);
        }

        // SEND TO SENDER (for sender UI)
        if (userSocketMap[senderId]) {
            io.to(senderId).emit("newMessage", newMessage);
        }

        return res.json({ success: true, newMessage });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
