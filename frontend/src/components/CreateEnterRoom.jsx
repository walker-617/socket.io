import socket from "../utils/Socket";
import { useNavigate } from "react-router-dom";
import { getRandomID } from "../utils/functions";
import { useEffect, useRef, useState } from "react";
import { serverURL } from "../utils/variables";

function CreateEnterRoom() {
  const navigate = useNavigate();
  const idRef = useRef();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${serverURL}/isServerOn`)
      .then((res) => res.text())
      .then((ack) => {
        if (ack === "yes") {
          setLoading(false);
        } else {
          setLoading(true);
        }
      });
  }, []);

  function createRoom() {
    setError("");
    const roomId = getRandomID();
    fetch(`${serverURL}/checkRoom/${roomId}`)
      .then((res) => res.json())
      .then((room) => {
        if (room.exists) {
          setError("Room ID already exists. Try again.");
          return;
        }
        socket.emit("createRoom", roomId);
        navigate(`/room/${roomId}`, {
          state: { role: "host", roomId: roomId },
        });
      });
  }

  function enterRoom() {
    setError("");
    const roomId = idRef.current.value;
    if (!roomId) {
      setError("Please enter a room ID");
      return;
    }
    fetch(`${serverURL}/checkRoom/${roomId}`)
      .then((res) => res.json())
      .then((room) => {
        if (!room.exists) {
          setError("Room ID does not exists");
          return;
        }
        socket.emit("enterRoom", roomId);
        navigate(`/room/${roomId}`, {
          state: { role: "guest", roomId: roomId },
        });
      });
  }

  return (
    <div style={{ margin: "10px" }}>
      <br />
      <button onClick={() => createRoom()} disabled={loading}>Create Room?</button>
      <br />
      <br />
      <div>Enter Room?</div>
      <input
        ref={idRef}
        type="text"
        placeholder="Enter Room ID"
        style={{ padding: "5px" }}
        disabled={loading}
      />{" "}
      <button onClick={() => enterRoom()} style={{ padding: "5px" }} disabled={loading}>
        Enter
      </button>
      {error ? <div style={{ color: "red" }}>{error}</div> : null}
      {loading ? <div style={{ color: "orange",marginTop:"20px" }}>Loading... <br></br>This might take a while.</div> : null}
    </div>
  );
}

export default CreateEnterRoom;
