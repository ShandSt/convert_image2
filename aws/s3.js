const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require( "../libs/s3Client.js");
const fs = require('fs');

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
});
      
const getImage = async (key) => {
  const bucketParams = {
    Bucket: "convertor-image-express",
    Key: key,
  };

  try {
    // Create a helper function to convert a ReadableStream to a string

    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    //console.log('0',data.Body);
    //return data.Body; // For unit tests.
    // Convert the ReadableStream to a string.
    const bodyContents = await streamToString(data.Body);
    //console.log(bodyContents);

    return bodyContents;
  } catch (err) {
    console.log("Error", err);
  }
};

const sendS3 = async (key, file) => {
  const params = {
    Bucket: "convertor-image-express",
    Key: key,
    Body: file,
    ContentType: 'image/png',
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