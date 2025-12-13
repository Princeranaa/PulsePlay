import express from 'express';
const router = express.Router();
import multer from 'multer'
import  {uploadMusic}  from '../controllers/music.controller.js';
import { authArtistMiddleware } from '../middleware/auth.middleware.js';   

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload', upload.fields([
    {name: 'music', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]), authArtistMiddleware, uploadMusic)



export default router;