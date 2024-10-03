const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname),
		);
	},
});

// File filter to only accept images (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
	const filetypes = /jpeg|jpg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		cb(null, true);
	} else {
		cb(new Error('Only images are allowed!'));
	}
};

// Initialize Multer
const upload = multer({
	storage,
	limits: { fileSize: 1000000 }, // 1MB limit
	fileFilter,
});

module.exports = upload;
