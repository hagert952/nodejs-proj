import  {Types,Schema,model} from 'mongoose'


const chatSchema=new Schema(
{
senderId:{type:Types.ObjectId,ref:"User",
    required:true
},
receiverId:{type:Types.ObjectId,ref:"User",required:true},
messages:[{

message:{type:String},
senderId:{type:Types.ObjectId,ref:"User"}
}]

},
  {timestamps:true}
);

export const Chat=model("Chat", chatSchema);
