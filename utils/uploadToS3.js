const AWS = require("aws-sdk");

const uploadFile = (fileName, fileData) => {
  // Read content from the file

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_ACCESSKEY,
    secretAccessKey: process.env.IAM_USER_SECRETKEY,
  });
  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: Date.now() + fileName, // File name you want to save as in S3
    Body: fileData,
    ACL: "public-read",
  };

  // Uploading files to the bucket
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(data.Location);
    });
  });
};

module.exports = uploadFile;
