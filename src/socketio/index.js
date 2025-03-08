import { Server } from "socket.io"
import {authSocket} from '../socketio/middleware/auth.middleware.js'
import {sendMessage} from "./chat/chat.js"
export const initSocket=(server)=>{
    const io=new Server(server,{
        cors:{origin:"*"},

    });
    io.use(authSocket)
    io.on("connection",(socket)=>{
        console.log(socket.id);
        socket.on("sendMessage",sendMessage(socket,io))
    //    socket.on("sendMessage",) 
    })

}