import socket from "../utils/Socket";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Room() {
  const msgRef = useRef("");
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state.role;
  const roomId = location.state.roomId;
  const id = socket.id;

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    function messageListener(msg) {
      setMessages((prevMessages) => [...prevMessages, msg]);
    }

    function leftRoomListener(id) {
      const child=document.createElement("div");
      child.innerHTML = id + " left the room";
      const parent=document.getElementById("parent");
      parent.appendChild(child);
      setTimeout(() => {
        parent.removeChild(child);
      }, 5000);
    }

    function newMemberListner(id){
      const child=document.createElement("div");
      child.innerHTML = id + " joined the room";
      const parent=document.getElementById("parent");
      parent.appendChild(child);
      setTimeout(() => {
        parent.removeChild(child);
      }, 5000);
    }

    socket.on("messageToClient", messageListener);
    socket.on("leftRoom",leftRoomListener);
    socket.on("newMember",newMemberListner);

    return () => {
      socket.off("messageToClient", messageListener);
      socket.off("leftRoom",leftRoomListener);
      socket.off("newMember",newMemberListner);
    };
  }, []);

  function sendMessage() {
    const msg = msgRef.current.value;
    socket.emit("messageToRoom", { id, roomId, msg, role });
    msgRef.current.value = "";
  }

  function leaveRoom() {
    socket.emit("leaveRoom", roomId);
    navigate("/");
  }

  return (
    <div id="parent">
      <input ref={msgRef} type="text" placeholder="Enter message" />
      <button
        onClick={() => {
          sendMessage();
        }}
      >
        Send
      </button>
      {messages.map((msg, i) => (
        <div key={i}>
          {messages[messages.length - 1 - i].id} (
          {messages[messages.length - 1 - i].role})
          {messages[messages.length - 1 - i].id === id ? "( You )" : ""} :{" "}
          {messages[messages.length - 1 - i].msg}
        </div>
      ))}
      <br />
      <button
        onClick={() => {
          leaveRoom();
        }}
      >
        Leave Room
      </button>
    </div>
  );
}

export default Room;
