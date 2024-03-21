import socket from "../utils/Socket";
import { useNavigate } from "react-router-dom";
import { getRandomID } from "../utils/functions";
import { useEffect, useRef, useState } from "react";

function CreateEnterRoom() {
  const navigate = useNavigate();
  const idRef = useRef();
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("error", (err) => {
      setError(err);
    });
  }, []);

  function createRoom() {
    setError("");
    const roomId = getRandomID();
    socket.emit("createRoom", roomId);
    if (!error) {
      navigate(`/room/${roomId}`, { state: { role: "host", roomId: roomId } });
    }
  }

  function enterRoom() {
    setError("");
    const roomId = idRef.current.value;
    if (!roomId) {
      setError("Please enter a room ID");
      return;
    }
    socket.emit("enterRoom", roomId);
    if (!error) {
      navigate(`/room/${roomId}`, { state: { role: "guest", roomId: roomId } });
    }
  }

  return (
    <div>
      <button onClick={() => createRoom()}>Create Room?</button>
      <div>Enter Room?</div>
      <input ref={idRef} type="text" placeholder="Enter Room ID" />
      <button onClick={() => enterRoom()}>Enter</button>
      {error ? <div style={{ color: "red" }}>{error}</div> : null}
    </div>
  );
}

export default CreateEnterRoom;
