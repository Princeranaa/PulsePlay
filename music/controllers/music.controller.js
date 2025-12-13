import { getFileUrl, uploadFile } from "../services/storage.service.js";
import { musicModel } from "../model/music.model.js";

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

export const getArtistMusic = async (req, res) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) {
      return res.status(400).json({ message: "Artist ID missing" });
    }

    // Fetch only required fields, lean() for performance
    const musicList = await musicModel
      .find({ artistId }, "title artist musicKey coverImageKey createdAt")
      .lean();

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
