const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    partNumber: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    barcode: {
        type: Number,
        required: true,
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