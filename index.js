import http from "http";
import express from 'express'
import bootstrap from './src/app.controller.js';
import dotenv from 'dotenv';import { Server } from "socket.io";
import { initSocket } from "./src/socketio/index.js";
dotenv.config();

const app = express()
const port = process.env.PORT || 3000
const server2 = http.createServer(app);
const io = new Server(server2, {
  cors: {
    origin: "*",
  },
});

export const hrSockets = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("registerHR", (hrId) => {
    hrSockets.set(hrId, socket.id);
  });

  socket.on("disconnect", () => {
    hrSockets.forEach((value, key) => {
      if (value === socket.id) {
        hrSockets.delete(key);
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

app.set("socketio", io);

await bootstrap(app,express);
const server= app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// sendEmail()
initSocket(server);