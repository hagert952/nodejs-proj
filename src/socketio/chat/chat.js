import { Chat } from "../../db/model/chat.js";

export const sendMessage=(socket,io)=>{
    return async (data)=>{
    const {message,receiverId}=data;
    // console.log(receiverId);
    
 socket.on("send_message",async({message,receiverId})=>{
    const chat = await Chat.findOneAndUpdate(
        { senderId: socket.id, receiverId },
        { $push: { messages: { message, senderId: socket.id } } },
        { new: true, upsert: true }
      );
      io.to(receiverId).emit("receive_message", chat);
    
  });}
 }
 


//     const chat=await Chat.findOne({users:{$all :[destId,
//         socket.id
//     ]}})
//     if(chat){
//         await Chat.updateOne({
// users:{$all:[destId,socket.id]}}
// ,{$push:{messages:{sender:socket.id,message }}   }
//     )}
// else{
//     await Chat.create({
//     users:[destId,socket.id]
//     ,messages:[{sender:socket.id,message}]    
//     })
// }
// // return res.status(200).json({success:true,
// //      message:"send successfully"})
// }

// }