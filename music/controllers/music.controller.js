import { getFileUrl, uploadFile } from "../services/storage.service.js";
import { musicModel } from "../model/music.model.js";
import { playlistModel } from "../model/playlist.model.js";

export const uploadMusic = async (req, res) => {
  const music = req.files.music[0];
  const coverImage = req.files.coverImage[0];
  const { title } = req.body;

  const artist = req.user.fullname.firstname + " " + req.user.fullname.lastname;
  const artistId = req.user.id;

  try {
    const musicResponse = await uploadFile(music);
    const coverImageResponse = await uploadFile(coverImage);

    const musicData = await musicModel.create({
      title,
      artist,
      artistId,
      musicKey: musicResponse.url,
      coverImageKey: coverImageResponse.url,
    });

    res.status(201).json({
      message: "music uploaded successfully",
      musicData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "internal server error",
    });
  }
};

export async function getMusicById(req, res) {
  const { id } = req.params;

  try {
    const music = await musicModel.findById(id).lean();

    if (!music) {
      return res.status(404).json({
        success: false,
        message: "Music not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Music fetched successfully",
      data: music,
    });
  } catch (error) {
    console.error("getMusicById error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching music",
    });
  }
}

export const getAllMusics = async (req, res) => {
  const { skip = 0, limit = 10 } = req.query;

  try {
    const musics = await musicModel
      .find()
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const formattedMusics = musics.map((music) => ({
      _id: music._id,
      title: music.title,
      artist: music.artist,
      musicUrl: music.musicKey, // already URL
      coverImageUrl: music.coverImageKey, // already URL
      createdAt: music.createdAt,
    }));

    return res.status(200).json({
      message: "Musics fetched successfully",
      musics: formattedMusics,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getArtistMusic = async (req, res) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) {
      return res.status(400).json({ message: "Artist ID missing" });
    }

    // Fetch only required fields, lean() for performance
    const musicList = await musicModel.find({ artistId }).lean();

    if (!musicList.length) {
      return res
        .status(200)
        .json({ message: "No music found for this artist", data: [] });
    }

    // Map music to include URLs via ImageKit service
    const musicWithUrls = musicList.map((m) => ({
      _id: m._id,
      title: m.title,
      artist: m.artist,
      musicUrl: m.musicKey, // just rename for clarity
      coverImageUrl: m.coverImageKey,
      createdAt: m.createdAt,
    }));

    res.status(200).json({
      message: "Artist music fetched successfully",
      data: musicWithUrls,
    });
  } catch (error) {
    console.error("Error fetching artist music:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPlaylist = async (req, res) => {
  const { title, musics } = req.body;

  try {
    const playlist = await playlistModel.create({
      artist: req.user.fullname.firstname + " " + req.user.fullname.lastname,
      artistId: req.user?.id,
      title,
      userId: req.user?.id,
      musics,
    });

    return res
      .status(201)
      .json({ message: "Playlist created successfully", playlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id });
    return res.status(200).json({ playlists });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlaylistById = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await playlistModel.findById(id).lean();

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const musics = await musicModel
      .find({ _id: { $in: playlist.musics } })
      .select("_id title artist musicKey coverImageKey createdAt")
      .lean();

    const formattedMusics = musics.map((m) => ({
      _id: m._id,
      title: m.title,
      artist: m.artist,
      musicUrl: m.musicKey,
      coverImageUrl: m.coverImageKey,
      createdAt: m.createdAt,
    }));

    res.status(200).json({
      playlist: {
        ...playlist,
        musics: formattedMusics,
      },
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
