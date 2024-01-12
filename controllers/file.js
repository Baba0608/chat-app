const uploadToS3 = require("../utils/uploadToS3");

const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    const fileName = file.originalname;
    const fileData = file.buffer;

    const result = await uploadToS3(fileName, fileData);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};

exports.uploadFile = uploadFile;
