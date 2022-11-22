const { times } = require('lodash');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb+srv://'+ process.env.MONGO_CONNECT +'/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const imageSchema = new mongoose.Schema(
    { 
        seesionId: String, 
        imageS3: String, 
        action: String, 
        queueId: String,
        convert: Boolean,
    }
);
const ImageModel = mongoose.model('images', imageSchema);

module.exports = ImageModel;