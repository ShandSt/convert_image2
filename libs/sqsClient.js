const  { SQSClient } =  require("@aws-sdk/client-sqs");
require('dotenv').config();
// Set the AWS Region.
const REGION = "us-west-2";
// Create SQS service object.
const sqsClient = new SQSClient({ region: REGION,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY
  	}
});
module.exports = { sqsClient };
