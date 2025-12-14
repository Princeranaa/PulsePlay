import React, { useState, useEffect } from "react";
import "./UploadMusic.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadMusic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    musicFile: null,
    coverImage: null,
  });

  const [previews, setPreviews] = useState({
    musicName: "",
    musicUrl: null,
    coverImage: null,
  });

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previews.musicUrl) URL.revokeObjectURL(previews.musicUrl);
      if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);
    };
  }, [previews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "music") {
        // Revoke old URL if exists
        if (previews.musicUrl) URL.revokeObjectURL(previews.musicUrl);

        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, musicFile: file }));
        setPreviews((prev) => ({
          ...prev,
          musicName: file.name,
          musicUrl: url,
        }));
      } else {
        // Revoke old URL if exists
        if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);

        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, coverImage: file }));
        setPreviews((prev) => ({ ...prev, coverImage: url }));
      }
    }
  };

  const handleRemove = (type) => {
    if (type === "music") {
      if (previews.musicUrl) URL.revokeObjectURL(previews.musicUrl);
      setFormData((prev) => ({ ...prev, musicFile: null }));
      setPreviews((prev) => ({ ...prev, musicName: "", musicUrl: null }));
    } else {
      if (previews.coverImage) URL.revokeObjectURL(previews.coverImage);
      setFormData((prev) => ({ ...prev, coverImage: null }));
      setPreviews((prev) => ({ ...prev, coverImage: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.musicFile) {
        data.append("music", formData.musicFile);
      }
      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      const response = await axios.post(
        "http://localhost:3002/api/music/upload",
        data,
        {
          withCredentials: true,
        }
      );

      console.log("Upload success:", response.data);
      // Navigate back to dashboard on success
      navigate("/artist/dashboard");
    } catch (error) {
      console.error("Error uploading music:", error);
      alert("Failed to upload music. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className="upload-container">
      <header className="upload-header">
        <h1 className="upload-title">Upload New Track</h1>
        <p className="upload-subtitle">Share your sound with the world</p>
      </header>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Track Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="e.g. Midnight Echoes"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Audio File</label>
          <div className="file-upload-area">
            {!previews.musicUrl ? (
              <>
                <input
                  type="file"
                  name="musicFile"
                  className="file-input"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, "music")}
                  required // only required if not already selected
                />
                <span className="upload-icon">♫</span>
                <span className="upload-text">
                  Drag & drop or click to upload audio
                </span>
              </>
            ) : (
              <div className="preview-container">
                <div className="file-name">{previews.musicName}</div>
                <div className="audio-preview-wrapper">
                  <audio
                    controls
                    className="audio-player"
                    src={previews.musicUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <button
                  type="button"
                  className="audio-remove-btn"
                  onClick={() => handleRemove("music")}
                >
                  Remove Track
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Art</label>
          <div
            className="file-upload-area"
            style={previews.coverImage ? { borderStyle: "solid" } : {}}
          >
            {!previews.coverImage ? (
              <>
                <input
                  type="file"
                  name="coverImage"
                  className="file-input"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  required
                />
                <span className="upload-icon">🖼️</span>
                <span className="upload-text">
                  Drag & drop or click to upload cover art
                </span>
              </>
            ) : (
              <div className="preview-container">
                <div className="image-preview-wrapper">
                  <img
                    src={previews.coverImage}
                    alt="Cover Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemove("image")}
                    title="Remove Image"
                  >
                    x
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload Release"}
        </button>
      </form>
    </div>
  );
};

export default UploadMusic;
