import ImageKit from "imagekit";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";
import path from "path"; 

const imageKit = new ImageKit({
  privateKey: config.privateKey,
  publicKey: config.publicKey,
  urlEndpoint: config.urlEndpoint,
});

export const uploadFile = async (file) => {
  // extract extension (.mp3, .wav, etc.)
  const ext = path.extname(file.originalname);

  // generate unique filename
  const uniqueFileName = `${uuidv4()}${ext}`;

  const response = await imageKit.upload({
    file: file.buffer,
    fileName: uniqueFileName,
    folder: "music",
  });
  return response;
};


export const getFileUrl = (fileId) => {
  if (!fileId) return null;
  return imageKit.url({ src: fileId });
};