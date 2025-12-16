import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ArtistDashboard from "./artist/ArtistDashboard";
import UploadMusic from "./artist/UploadMusic";
import MusicPlayer from "./music/MusicPlayer";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("localhost:3002", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("play", (data) => {
      const musicId = data.musicId;
      window.location.href = `/music/${musicId}`;
    });
  }, []);

  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route
            path="/artist/dashboard/upload-music"
            element={<UploadMusic />}
          />
          <Route path="/music/:id" element={<MusicPlayer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
