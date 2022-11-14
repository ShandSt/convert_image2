const { times } = require('lodash');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://stas:qwe12391@cluster0.gtg0hlw.mongodb.net/?retryWrites=true&w=majority', {
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