import express from 'express';
import { upload, uploadMedia, getAllMedia, deleteMediaItem } from '../controllers/mediaController.js';

const mediaRouter = express.Router();

mediaRouter.post('/media/upload', upload.array('images', 10), uploadMedia);
mediaRouter.get('/media', getAllMedia);
mediaRouter.delete('/media/:id', deleteMediaItem);

export default mediaRouter;
