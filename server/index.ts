import http from "http";
import express from "express";
import dotenv from "dotenv";
import router from "./src/routes";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT;
const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(router);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(socket.rooms);
  socket.broadcast.emit("userIn", socket.id);

  socket.on("sendVideoChunk", (chunk) => {
    socket.broadcast.emit("receiveVideoChunk", chunk, socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
