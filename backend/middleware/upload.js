const multer = require('multer');
const path = require('path');

// Configure where to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Set up multer with storage, size limits, and file type filtering
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const extOkay = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOkay = allowed.test(file.mimetype);
    if (extOkay && mimeOkay) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
  }
});

module.exports = upload;
