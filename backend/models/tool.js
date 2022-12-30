const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    serialNumber: {
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
    partNumber: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    status: {
        type: String,
        upperCase: true,
        required: true,
        maxLength: 20
    },
    description: {
        type: String,
        maxLength: 128
    },
    manufacturer: {
        type: String,
        maxLength: 28,
        trim: true,
    }},
    {
    timestamps: true,
    strict: false
});

const Tool = mongoose.model('tool', toolSchema)

module.exports = Tool