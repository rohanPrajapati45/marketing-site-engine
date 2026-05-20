import express from 'express';
import { verifyAdmin } from '../middleware/auth/authMiddleware.js';
import {
  upload,
  uploadImage,
  uploadMedia,
  getMedia,
  getAllMedia,
  deleteMedia,
  deleteMediaItem,
  updateMediaAlt,
} from '../controllers/mediaController.js';

const mediaRouter = express.Router();

// ═══════════════════════════════════════════════════════════════
// Legacy routes (mounted at /admin in app.js)
// ═══════════════════════════════════════════════════════════════
mediaRouter.post('/media/upload', (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadMedia);
mediaRouter.get('/media', getAllMedia);
mediaRouter.delete('/media/:id', deleteMediaItem);

export default mediaRouter;

// ═══════════════════════════════════════════════════════════════
// New API media routes (mounted at /api/media in app.js)
// All routes require admin auth
// ═══════════════════════════════════════════════════════════════
export const mediaApiRouter = express.Router();

mediaApiRouter.use(verifyAdmin);

// Wrap multer in a callback to properly catch errors with Express 5
mediaApiRouter.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadImage);

mediaApiRouter.get('/',        getMedia);
mediaApiRouter.delete('/:id',  deleteMedia);
mediaApiRouter.patch('/:id/alt', updateMediaAlt);
