import Room from "./components/Room";
import CreateEnterRoom from "./components/CreateEnterRoom";
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateEnterRoom/>}/>
          <Route path="/room/:id" element={<Room/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
