const multer = require("multer");
const path = require("path");


const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
const allowedFileTypes = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, "uploads/images");
    } else {
      cb(null, "uploads/files"); 
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Validate file types and sizes
const fileFilter = (req, file, cb) => {
  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedFileTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, CSV, and Excel files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
