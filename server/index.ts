import http from "http";
import express from "express";
import dotenv from "dotenv";
import router from "./src/routes";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT;
const app = express();
const keyFrames = new Map<
  string,
  { buffer: ArrayBuffer; type: string; timestamp: number }
>();

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(router);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("joinConference", () => {
    socket.broadcast.emit("userIn", socket.id);

    for (let [socketId, keyFrame] of keyFrames) {
      if (socketId === socket.id) continue;
      socket.emit("receiveKeyFrame", keyFrame, socketId);
    }
  });

  socket.on("sendVideoChunk", (chunk) => {
    let isKeyFrame = chunk.type === "key";

    if (isKeyFrame) keyFrames.set(socket.id, chunk);

    socket.broadcast.emit(
      isKeyFrame ? "receiveKeyFrame" : "receiveVideoChunk",
      chunk,
      socket.id
    );
  });

  socket.on("disconnect", () => {
    keyFrames.delete(socket.id);
    socket.broadcast.emit("userOut", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
