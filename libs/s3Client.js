// Create service client module using ES6 syntax.
const { S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config();
// Set the AWS Region.
const REGION = "us-east-1";
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY	
  	}
});
module.exports = { s3Client };