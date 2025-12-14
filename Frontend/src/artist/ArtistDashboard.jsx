import React, { useEffect, useState } from "react";
import "./ArtistDashboard.css";
import axios from "axios";

const ArtistDashboard = () => {
  const [musics, setMusics] = useState([
    {
      id: 1,
      title: "Midnight Echoes",
      artist: "Lunar Wanderer",
      coverImageUrl:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60",
      musicUrl: "#",
    },
    {
      id: 2,
      title: "Neon Horizon",
      artist: "Cyber Soul",
      coverImageUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
      musicUrl: "#",
    },
    {
      id: 3,
      title: "Urban Jungle",
      artist: "Street Beat",
      coverImageUrl:
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60",
      musicUrl: "#",
    },
    {
      id: 4,
      title: "Serenity",
      artist: "Nature Sounds",
      coverImageUrl:
        "https://images.unsplash.com/photo-1459749411177-334811adb217?w=500&auto=format&fit=crop&q=60",
      musicUrl: "#",
    },
  ]);

  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      title: "Chill Vibes",
      artist: "Lunar Wanderer",
      musics: [1, 2, 4], // Mocking array of music IDs or objects
    },
    {
      id: 2,
      title: "Workout Mix",
      artist: "Power Lifter",
      musics: [2, 3],
    },
  ]);

  const gerArtistMusic = async () => {
    const response = await axios.get(
      "http://localhost:3002/api/music/artist-music",
      { withCredentials: true }
    );

    // console.log("response----->", response)
    setMusics(response.data.data);
  };

  const gerArtistPlaylists = async () => {
    const response = await axios.get(
      "http://localhost:3002/api/music/playlist/artist",
      { withCredentials: true }
    );
      console.log("PLAYLIST DATA:", response.data.data);
    setPlaylists(response.data.playlists);
  };

  useEffect(() => {
    gerArtistMusic();
    gerArtistPlaylists();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Artist Dashboard</h1>
      </header>

      {/* Music Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">My Music</h2>
          <button className="action-btn">+ Upload Music</button>
        </div>
        <div className="grid-layout">
          {musics.map((music) => (
            <div key={music.id} className="card">
              <div
                className="card-image-placeholder"
                style={{
                  backgroundImage: `url(${music.coverImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "transparent",
                }}
              >
                ♫
              </div>
              <div className="card-title">{music.title}</div>
              <div className="card-subtitle">{music.artist}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlist Section */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">My Playlists</h2>
          <button className="action-btn">+ Create Playlist</button>
        </div>
        <div className="grid-layout">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="card">
              <div className="card-image-placeholder">◎</div>
              <div className="card-title">{playlist.title}</div>
              <div className="card-subtitle">
                {playlist.artist} • {playlist.musics.length} Tracks
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtistDashboard;
