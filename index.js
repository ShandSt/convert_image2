const express = require('express');
const app = express();
const listener = require('./listener/listener');

listener.consumer.on('error', (err) => {
  console.log(err.message);
});
app.on('processing_error', (err) => {
  console.error(err.message);
});
listener.consumer.start();