const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const { sqsClient } = require('../libs/sqsClient.js');
require('dotenv').config();

const sendMessage = async function (seesionId) {
  // Set the parameters
  const queueURL = process.env.SQS_URL_DOWNLOAD; 

  const params = {
    DelaySeconds: 10,
    MessageBody: 'download image ' + seesionId,
    QueueUrl: queueURL
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = { sendMessage };