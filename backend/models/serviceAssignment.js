const mongoose = require('mongoose');

const serviceAssignmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: {
        type: String,
        required: true,
        maxLength: 128
    },
    description: {
        type: String,
        maxLength: 128
    },

},{
    timestamps: true,
});

const ServiceAssignment = mongoose.model('serviceAssignment', serviceAssignmentSchema, "serviceAssignments")

module.exports = ServiceAssignment