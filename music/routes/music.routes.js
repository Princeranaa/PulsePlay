import express from 'express';
const router = express.Router();
import multer from 'multer'
import  {uploadMusic,getArtistMusic,createPlaylist,getPlaylists, getAllMusics, getPlaylistById, getMusicById }  from '../controllers/music.controller.js';
import { authArtistMiddleware, authUserMiddleware } from '../middleware/auth.middleware.js';   

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload', upload.fields([
    {name: 'music', maxCount: 1},
    {name: 'coverImage', maxCount: 1}
]), authArtistMiddleware, uploadMusic);


/* GET /api/music */
router.get('/', authUserMiddleware, getAllMusics);

/* GET /api/music/get-details/:id */
router.get('/get-details/:id', authUserMiddleware, getMusicById);

/* GET /api/music/artist-musics */
router.get('/artist-music', authArtistMiddleware, getArtistMusic);

/* POST /api/music/playlist */
router.post('/playlist', authArtistMiddleware, createPlaylist);

/* GET /api/music/playlists */
router.get('/playlist', authUserMiddleware, getPlaylists);

/* GET /api/music/playlist/:id */
router.get('/playlist/:id', authUserMiddleware, getPlaylistById);



export default router;