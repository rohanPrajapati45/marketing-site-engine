// Standalone debug: replicate the exact upload flow
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Verify admin (same as prod)
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] OK - admin:', req.admin.id);
    next();
  } catch { return res.status(401).json({ message: 'Invalid token' }); }
};

// Debug upload route
app.post('/test-upload', verifyAdmin, (req, res, next) => {
  console.log('[MULTER] Starting...');
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.log('[MULTER] ERROR:', err.message);
      return res.status(400).json({ error: err.message });
    }
    console.log('[MULTER] OK, file:', req.file ? {
      fieldname: req.file.fieldname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length,
    } : 'NO FILE');
    console.log('[MULTER] body:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No file' });
    }

    // Try Cloudinary upload
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'tedmob/test', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.log('[CLOUDINARY] ERROR:', error);
          return res.status(500).json({ error: error.message });
        }
        console.log('[CLOUDINARY] OK:', result.secure_url);
        res.json({ success: true, url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  });
});

app.listen(3099, () => console.log('Debug server on http://localhost:3099'));

// Auto-test after 1 second
setTimeout(async () => {
  try {
    // Login to get token from real server
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'mainadmin@example.com', password: 'mainadminpassword' }),
    });
    const cookies = loginRes.headers.getSetCookie();
    const tokenCookie = cookies?.find(c => c.startsWith('token='))?.split(';')[0] || '';
    console.log('\n[TEST] Got cookie:', tokenCookie.slice(0, 30) + '...');

    // Upload to debug server
    const boundary = '---b' + Date.now();
    const pngBuf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\ngeneral\r\n--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`),
      pngBuf,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadRes = await fetch('http://localhost:3099/test-upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Cookie': tokenCookie,
      },
      body: body,
    });
    const result = await uploadRes.json();
    console.log('[TEST] Upload result:', uploadRes.status, JSON.stringify(result));
    process.exit(0);
  } catch (e) {
    console.log('[TEST] Error:', e.message);
    process.exit(1);
  }
}, 1000);
