import getCloudinary from '../config/cloudinary.js';
import multer from 'multer';
import Media from '../models/Media.js';

// Multer memory storage (files go to buffer, then to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ─────────────────────────────────────────
// POST /api/media/upload
// Admin uploads image → Cloudinary → saves to DB
// Accepts: multipart/form-data with field 'image' + 'folder'
// ─────────────────────────────────────────
export const uploadImage = async (req, res) => {
  try {
    console.log('=== UPLOAD START ===');
    console.log('req.file exists:', !!req.file);
    if (req.file) {
      console.log('  fieldname:', req.file.fieldname);
      console.log('  mimetype:', req.file.mimetype);
      console.log('  size:', req.file.size);
      console.log('  hasBuffer:', !!req.file.buffer);
      console.log('  bufferLength:', req.file.buffer?.length);
    }
    console.log('req.body:', JSON.stringify(req.body));

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'File buffer is empty',
      });
    }

    const folder = req.body.folder || 'general';

    const allowedFolders = [
      'hero', 'projects', 'casestudies',
      'solutions', 'contact', 'general'
    ];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: `Invalid folder. Must be one of: ${allowedFolders.join(', ')}`,
      });
    }

    console.log('Uploading to Cloudinary folder: tedmob/' + folder);

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = getCloudinary().uploader.upload_stream(
        {
          folder: 'tedmob/' + folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload_stream error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload OK:', result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    console.log('Saving to MongoDB...');

    // Save to MongoDB
    const media = await Media.create({
      url:          uploadResult.secure_url,
      publicId:     uploadResult.public_id,
      folder:       folder,
      originalName: req.file.originalname,
      size:         uploadResult.bytes,
      width:        uploadResult.width,
      height:       uploadResult.height,
      format:       uploadResult.format,
    });

    console.log('=== UPLOAD SUCCESS ===', media._id);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: media,
    });
  } catch (error) {
    const fs = await import('fs');
    const errInfo = {
      type: typeof error,
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      keys: error ? Object.keys(error) : [],
      stringified: JSON.stringify(error, Object.getOwnPropertyNames(error || {})),
    };
    fs.writeFileSync('./upload-error.json', JSON.stringify(errInfo, null, 2));
    console.error('=== UPLOAD ERROR (written to upload-error.json) ===', errInfo);
    res.status(500).json({
      success: false,
      message: error?.message || 'Upload failed',
    });
  }
};

// ─────────────────────────────────────────
// UPLOAD (multiple images) — legacy support
// POST /admin/media/upload
// ─────────────────────────────────────────
export const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = req.body.folder || 'general';
    const uploadedMedia = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = getCloudinary().uploader.upload_stream(
          {
            folder: 'tedmob/' + folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      const media = await Media.create({
        url: result.secure_url,
        publicId: result.public_id,
        folder: folder,
        originalName: file.originalname,
        size: file.size,
      });
      uploadedMedia.push(media);
    }

    return res.status(201).json({
      success: true,
      data: uploadedMedia,
    });
  } catch (error) {
    console.error('Legacy upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────
// GET /api/media
// Get all media — optionally filter by folder
// Query: ?folder=hero
// ─────────────────────────────────────────
export const getMedia = async (req, res) => {
  try {
    const { folder } = req.query;
    const filter = folder ? { folder } : {};

    const media = await Media.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MEDIA — legacy alias
export const getAllMedia = getMedia;

// ─────────────────────────────────────────
// DELETE /api/media/:id
// Delete from Cloudinary AND MongoDB
// ─────────────────────────────────────────
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found',
      });
    }

    // Delete from Cloudinary first
    await getCloudinary().uploader.destroy(media.publicId);

    // Then delete from MongoDB
    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Legacy alias
export const deleteMediaItem = deleteMedia;

// ─────────────────────────────────────────
// PATCH /api/media/:id/alt
// Update alt text only
// ─────────────────────────────────────────
export const updateMediaAlt = async (req, res) => {
  try {
    const { altText } = req.body;

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { altText },
      { new: true }
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found',
      });
    }

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
