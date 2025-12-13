import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <main>
        <Routes>
          {/* <Route path="/" element={<Home socket={socket} />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/artist/dashboard/upload-music" element={<UploadMusic />} />
          <Route path="/music/:id" element={<MusicPlayer />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
