const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '';
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  },
});

const imageFilter = (_req, file, cb) => {
  if (/^image\//.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const videoFilter = (_req, file, cb) => {
  if (/^video\//.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only video files are allowed'), false);
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: videoFilter,
});

router.post('/image', adminAuth, uploadImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

router.post('/video', adminAuth, uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : err.message });
  }
  if (err) return res.status(400).json({ message: err.message });
  res.status(500).json({ message: 'Upload failed' });
});

module.exports = router;
