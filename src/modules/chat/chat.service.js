import { Chat } from "../../db/model/chat.js";

export const sendMessage=async (req,res,next)=>{
    const {message,hrId}=req.body;
    const chat=await Chat.findOne({users:{$all :[hrId,
        req.authuser._id
    ]}})
    if(chat){
        console.log(senderId);
        
        await Chat.updateOne({
users:{$all:[hrId,req.authuser._id]}}
,{$push:{messages:{senderId:req.authuser._id,message }}   }
    )}
else{
    await Chat.create({
    users:[hrId,req.authuser._id]
    ,messages:[{senderId:req.authuser._id,message}]    
    })
}
return res.status(200).json({success:true,
     message:"send successfully"})
}
export const send = async (req, res,next) => {
    //   if (req.user.role !== 'HR' && req.user.role !== 'COMPANY_OWNER') {
    //     return res.status(403).json({ message: 'Permission denied!' });
    //   }
      const { receiverId } = req.body;
      let chat = await Chat.findOne({ senderId: req.authuser._id, receiverId:receiverId });
      if (!chat) {
        chat = new Chat({ senderId: req.authuser._id, receiverId:receiverId, messages: [] });
        await chat.save();
      }
      res.status(200).json(chat);
 
  }