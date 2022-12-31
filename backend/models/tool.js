const mongoose = require('mongoose');
const serviceAssignment = require('./serviceAssignment');

const toolSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    serialNumber: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    partNumber: {
        type: String,
        upperCase: true,
        maxLength: 20
    },
    barcode: {
        type: Number,
        maxLength: 10
    },
    status: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    serviceAssignment: {
        type: String,
        upperCase: true,
        ref: 'serviceAssignment',
    },
    description: {
        type: String,
        maxLength: 128
    },
    manufacturer: {
        type: String,
        maxLength: 28,
        trim: true,
    },
    archived: {
        type: Boolean,
        default: false
    },
    createdBy: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    updatedBy: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    image: {
        type: String,
    },
},
    {
    timestamps: true,
    strict: false
});

const Tool = mongoose.model('tool', toolSchema)

module.exports = Tool