import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB(){
 await   mongoose.connect(process.env.DB_URL,).then(()=>{

    console.log("db connected successfully");
    
 }).catch((error)=>{
    console.log("fail to connect to db",error.message);
    
 })
}

export default connectDB;