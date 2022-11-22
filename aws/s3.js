const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require( "../libs/s3Client.js");
const fs = require('fs');
require('dotenv').config();

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
});
      
const getImage = async (key) => {
  const bucketParams = {
    Bucket: process.env.BUCKET,
    Key: key,
  };

  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    //return data.Body; // For unit tests.
    // Convert the ReadableStream to a string.
    const bodyContents = await streamToString(data.Body);

    return bodyContents;
  } catch (err) {
    console.log("Error", err);
  }
};

const sendS3 = async (key, file) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: key,
    Body: file,
    "ContentType": "image/jpeg",
  };

  try {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = { getImage, sendS3 };