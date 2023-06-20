const mongoose = require('mongoose');

const volunteerSchema = mongoose.Schema([{
    email: {
        type: String
    },
    fullName : {
        type : String
    },
    date : {
        type: String
    },
    description : {
        type: String
    },
    task :{
        type : String
    }
}]);

const VolunteerModel = mongoose.model('Volunteer', volunteerSchema);

module.exports = VolunteerModel;