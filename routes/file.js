const express = require("express");
const multer = require("multer");
const upload = multer();

const authorization = require("../middleware/auth");
const fileControllers = require("../controllers/file");

const router = express.Router();

router.post(
  "/upload",
  authorization,
  upload.single("my-file"),
  fileControllers.uploadFile
);

module.exports = router;
