import socket from "../utils/Socket";
import { useNavigate } from "react-router-dom";
import { getRandomID } from "../utils/functions";
import { useEffect, useRef, useState } from "react";
import { serverURL } from "../utils/variables";

function CreateEnterRoom() {
  const navigate = useNavigate();
  const idRef = useRef();
  const [error, setError] = useState("");

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
        navigate(`/room/${roomId}`, { state: { role: "host", roomId: roomId } });
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
        navigate(`/room/${roomId}`, { state: { role: "guest", roomId: roomId } });
      });
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

// import socket from "../utils/Socket";
// import { useNavigate } from "react-router-dom";
// import { getRandomID } from "../utils/functions";
// import { useRef, useState } from "react";

// function CreateEnterRoom() {
//   const navigate = useNavigate();
//   const idRef = useRef();
//   const [error, setError] = useState("");

//   function createRoom() {
//     setError("");
//     const roomId = getRandomID();
//     socket.emit("createRoom", roomId);
//     if (!error) {
//       navigate(`/room/${roomId}`, { state: { role: "host", roomId: roomId } });
//     }
//   }

//   function enterRoom() {
//     setError("");
//     const roomId = idRef.current.value;
//     if (!roomId) {
//       setError("Please enter a room ID");
//       return;
//     }
//     socket.emit("enterRoom", roomId);
//     if (!error) {
//       navigate(`/room/${roomId}`, { state: { role: "guest", roomId: roomId } });
//     }
//   }

//   return (
//     <div>
//       <button onClick={() => createRoom()}>Create Room?</button>
//       <div>Enter Room?</div>
//       <input ref={idRef} type="text" placeholder="Enter Room ID" />
//       <button onClick={() => enterRoom()}>Enter</button>
//       {error ? <div style={{ color: "red" }}>{error}</div> : null}
//     </div>
//   );
// }

// export default CreateEnterRoom;
