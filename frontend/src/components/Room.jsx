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
      if (id === socket.id) {
        return;
      }
      const child = document.createElement("div");
      child.innerHTML = id + " left the room";
      const parent = document.getElementById("parent");
      parent.appendChild(child);
      setTimeout(() => {
        parent.removeChild(child);
      }, 5000);
    }

    function newMemberListner(id) {
      if (id === socket.id) {
        return;
      }
      const child = document.createElement("div");
      child.innerHTML = id + " joined the room";
      const parent = document.getElementById("parent");
      parent.appendChild(child);
      setTimeout(() => {
        parent.removeChild(child);
      }, 5000);
    }

    socket.on("messageToClient", messageListener);
    socket.on("leftRoom", leftRoomListener);
    socket.on("newMember", newMemberListner);

    return () => {
      socket.off("messageToClient", messageListener);
      socket.off("leftRoom", leftRoomListener);
      socket.off("newMember", newMemberListner);
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
    <div id="parent" style={{ margin: "10px" }}>
      <h1>Room ID : {roomId}</h1>
      <button onClick={leaveRoom}>Leave Room</button>
      <br />
      <br />
      <input ref={msgRef} type="text" placeholder="Enter message" style={{padding:"5px"}}/>{" "}
      <button onClick={sendMessage} style={{padding:"5px"}}>Send</button>
      <br />
      <br />
      <div>Messages : </div>
      {messages.map((msg, i) => (
        <div style={{ margin: "10px" }} key={i}>
          <div style={{ fontSize: "12px", color: "gray" }}>
            {messages[messages.length - 1 - i].id} (
            {messages[messages.length - 1 - i].role})
            {messages[messages.length - 1 - i].id === id && "( You )"}
          </div>
          <div>{messages[messages.length - 1 - i].msg}</div>
        </div>
      ))}
      <br />
      <div>Notifications : </div>
    </div>
  );
}

export default Room;
