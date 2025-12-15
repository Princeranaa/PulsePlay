import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MusicPlayer.css";
import axios from "axios";

export default function MusicPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const animationRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Format time helper
  const formatTime = useCallback((s) => {
    if (!Number.isFinite(s)) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }, []);

  // Load metadata
  function handleLoadedMetadata() {
    const d = audioRef.current?.duration;
    if (d) setDuration(d);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }

  function whilePlaying() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  function handleProgressChange(e) {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  }

  function handleVolumeChange(e) {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }

  function handleRateChange(e) {
    const val = Number(e.target.value);
    setPlaybackRate(val);
    if (audioRef.current) audioRef.current.playbackRate = val;
  }

  function skip(delta) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + delta),
      duration
    );
  }

  // Cleanup animation frame
  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);

  // Apply volume & playback rate w0hen component mounts or changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Auto navigate if invalid id
  useEffect(() => {
    axios
      .get(`http://localhost:3002/api/music/get-details/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setTrack(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        // navigate('/')
      });
  }, []);

  if (!track) {
    // Fetch track details from backend
    return <div>Loading...</div>;
  }

return (
  <div className="music-player-page">
    <header className="player-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </header>

    <div className="player-card">
      <div className="cover-wrapper">
        <img
          src={track.coverImageKey}
          alt={track.title}
          className="player-cover"
        />
      </div>

      <div className="player-info">
        <h2 className="track-title">{track.title}</h2>
        <p className="track-artist">{track.artist}</p>
      </div>

      <audio
        ref={audioRef}
        src={track.musicKey}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        autoPlay
      />

      {/* Progress */}
      <div className="progress-section">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => skip(-10)}>⏪</button>

        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={() => skip(10)}>⏩</button>
      </div>

      {/* Extras */}
      <div className="extras">
        <div className="extra-control">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>

        <div className="extra-control">
          <label>Speed {playbackRate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            value={playbackRate}
            onChange={handleRateChange}
          />
        </div>
      </div>
    </div>
  </div>
);

}
