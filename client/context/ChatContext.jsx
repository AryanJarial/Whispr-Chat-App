import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";



export const ChatContext = createContext();

export const ChatProvider = ({children}) =>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] =useState(null);
    const [unseenMessages, setUnseenMessages] =useState({});

    const {socket, axios} = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to get messages for selected users

    const getMessages = async (userId) =>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to send message to selected user
    const sendMesage = async (messageData) =>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {

    }

    return (
    <ChatContext.Provider value={}>
        {children}
    </ChatContext.Provider>
    ) 
}