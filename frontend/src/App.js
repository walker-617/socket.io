import Room from "./components/Room";
import CreateEnterRoom from "./components/CreateEnterRoom";
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div>
      <div style={{backgroundColor:"black", color:"white",padding:"5px",marginBottom:"10px", fontSize:"10px"}}>Note: Since this is deployed on a free service, the server will spin down after 15 minutes of inactivity and spin up again when a new request comes. This causes the loading to take some time. For more details, check <a href="https://docs.render.com/free#:~:text=Render%20spins%20down,will%20hang%20temporarily." target="_blank"  style={{color:"white"}}>here</a>.</div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateEnterRoom/>}/>
          <Route path="/room/:id" element={<Room/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
