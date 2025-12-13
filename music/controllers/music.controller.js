import { uploadFile } from '../services/storage.service.js'
import  {musicModel} from '../model/music.model.js'


export const uploadMusic = async (req,res) => {

    const music = req.files.music[0];
    const coverImage = req.files.coverImage[0];
    const {title} = req.body;

    const artist = req.user.fullname.firstname + " " + req.user.fullname.lastname
    const artistId = req.user.id

    try {
        
        const musicResponse = await uploadFile(music);
        const coverImageResponse = await uploadFile(coverImage);

        const musicData = await musicModel.create({
            title,
            artist,
            artistId,
            musicKey: musicResponse.fileId,
            coverImageKey: coverImageResponse.fileId,
        })

        res.status(201).json({
            message: "music uploaded successfully",
            musicData
        })

    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "internal server error"
        })
    }




    
}