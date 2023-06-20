const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema([{
    id: {
        type: Number,
    },
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    bgColor: {
        type : String
    }
}]);

const ServicesModel = mongoose.model('socialService', servicesSchema);

module.exports = ServicesModel;