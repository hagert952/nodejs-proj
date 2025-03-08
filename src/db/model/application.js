import  {Types,Schema,model} from 'mongoose'
import { Chat } from './chat.js';
export const status= {
PENDING:  'pending',
  ACCEPTED: 'accepted',
   VIEWED: 'viewed', 
 INCONSIDERATION   :'in consideration',
    REJECTED: 'rejected'
  }


const applicationSchema=new Schema(
{
jobId:{type:Types.ObjectId,ref:"JobOpportunity"},
userId:{type:Types.ObjectId,ref:"User"},
userCV:{secure_url:String,public_id:String},
status:{type:String, enum:Object.values(status), default: status.ACCEPTED }

},
  {timestamps:true}
);
applicationSchema.pre('remove', async function (next) {
  const application = this;
  // Delete related chats
  await Chat.deleteMany({ $or: [{ senderId: application.userId }, { receiverId: application.userId }] });
  next();
});
export const Application=model("Application", applicationSchema);
