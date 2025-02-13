import React, { useEffect, useState } from "react";
import { user } from "../join/join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../../client/src/images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from 'react-scroll-to-bottom';


const ENDPOINT = "http://localhost:4000";

let socket;

export default function Chat() {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]); 

  const send = () => {
    const message = document.getElementById("chatInput").value;
    if (message.trim()) {
      socket.emit("message", { message, id });
      document.getElementById("chatInput").value = "";
    }
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("Connected");
      setId(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      console.log(data.user, data.message, data.id);
      setMessages([...messages, data]);
    });

    return () => {
      socket.off("sendMessage");
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>Chatzilla</h2>
          <a style={{textDecoration:"none", color:'black'}} href="/"><i className="fa-solid fa-x"></i></a>  
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message key={i} user={item.id === id ? "You" : item.user} message={item.message} classs={item.id === id ? "right" : "left"} />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input type="text" placeholder="Enter Message here" id="chatInput" onKeyDown={(e) => e.key === "Enter" && send()} />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
}
