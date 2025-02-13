import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const users = [{}];
const port = process.env.PORT || 4000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("It's working!");
});

io.on("connection", (socket) => {
    console.log("New Connection");

    socket.on("joined", ({ user }) => {
        users[socket.id] = user;
        console.log(`User has joined: ${user}`);

        socket.emit("welcome", { user: "admin", message: "Welcome to the chat!" });
        socket.broadcast.emit("userJoined", { user:"Admin", message: `${user} has joined` });
    });

    socket.on("message", ({ message, id }) => {
        io.emit("sendMessage", { user: users[id], message, id });
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];
        console.log(`${user} disconnected`);
        socket.broadcast.emit("leave", { user: "Admin", message: `${user} has left` });
        delete users[socket.id];  
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});