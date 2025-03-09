import cron from "node-cron";
import connectDB from './db/connection.js';
import authRouter from './modules/auth/auth.controller.js'
import userrouter from './modules/user/user.controller.js'
import chatrouter from './modules/chat/chat.controller.js'
import jobRouter from './modules/jobsopportunity/jobs.controller.js'
import applicationRouter from './modules/application/application.controller.js'
import companyRouter from './modules/company/company.controller.js'
// import postRouter from './modules/posts/posts.controller.js'
import {notfound} from './utils/error handling/not-found.js'
import {globalerror} from './utils/error handling/global-error.js'
// import {globalerror} from './utils/globalerror.js'
//  import commentRouter from './modules/comments/commentscontroller.js'
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { User } from './db/model/user.model.js';
import {schema} from './app.schema.js';
import { createHandler } from "graphql-http/lib/use/express";
import bodyParser from "body-parser";
const bootstrap =async (app,express)=>{
   //cors
app.use(cors("*"))
app.use(rateLimit({
  windowMs:3*60*1000,
  limit:5,
  handler:(req,res,next,options)=>{
    return next(new Error(options.message,{cause:options.statusCode}))
  }
}))
   app.use(express.json());
   // app.use ("/uploads",express.static("uploads"))
  await connectDB();
  app.use(bodyParser.json());
  
  
  app.all("/graphql",createHandler({schema
    ,context:(req)=>{
       const {authorization}=req.headers;
       return {authorization}
    }
    ,formatError:(error)=>{
       return{
          success:false,
          statusCode:error.originalError?.cause||500
          ,message:error.originalError?.message 
       ,stack:error.originalError?.stack
       }
    }
      }))
  const deleteExpiredOTPs = async () => {
    const date = new Date();
    try {
      await User.updateMany(
        { "OTP.expiresIn": { $lt: date } },
        { $pull: { OTP: { expiresIn: { $lt: date } } } }
      );

    } catch (error) {
  
    }
  };
  
  cron.schedule('0 */6 * * *', () => {
  
    deleteExpiredOTPs();
  });

 await app.use("/auth",authRouter)
 await app.use("/company",companyRouter)
 await app.use("/job",jobRouter)
  await app.use ('/users',userrouter)
  await app.use ('/chat',chatrouter)
  await app.use ('/application',applicationRouter)
 await app.use(globalerror);

 await  app.all("*",notfound)
}

export default bootstrap;
