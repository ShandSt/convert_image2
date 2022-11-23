const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const https = require('https');
const Images = require('../models/Image');
const awsS3 = require('../aws/s3.js');
const awsSqs = require('../aws/sqs.js');
const sharp = require('../convert/sharp.js');
const fs = require('fs');
const fileType = require('file-type');

require('dotenv').config();

AWS.config.update({
  	region: process.env.REGION_SQS,
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const consumer = Consumer.create({
  queueUrl: process.env.SQS_URL,
  handleMessage: async (message) => {
    
	const image = await Images.findOne({ queueId: message.MessageId, convert: false});
	const img = await awsS3.getImage(image.imageS3);
	if (image.action === 'videoToGif') {
		await fs.writeFileSync("video.mp4", img, {encoding:'utf8',flag:'w'});
	}
	
	const foramtImg = await fileType(img);
	const newImg = await sharp.convertAction(image.action, img, foramtImg.ext);

	const foramtImage = await fileType(newImg);
	const fileName = 'download_at_' + Date.now() + '-' + Math.round(Math.random() * 1E9) +'.'+ foramtImage.ext; 

	await awsS3.sendS3(fileName, newImg);
	const {MessageId} = await awsSqs.sendMessage(image.seesionId);

	await Images.findOneAndUpdate({queueId: message.MessageId}, 
		{queueId: MessageId, imageS3: fileName, convert: true},
		{upsert: true}, function(err, doc) {
			if (err) console.log(err);
			console.log('finish');
	});	
  },
  sqs: new AWS.SQS({
    httpOptions: {
      agent: new https.Agent({
        keepAlive: true
      })
    }
  })
});

module.exports = { consumer };