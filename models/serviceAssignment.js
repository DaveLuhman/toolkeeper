import { Schema, model } from 'mongoose';

const serviceAssignmentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    text: {
        type: String,
        required: true,
        maxLength: 128
    },
    description: {
        type: String,
        maxLength: 128
    },

}, {
    timestamps: true,
});

const ServiceAssignment = model('serviceAssignment', serviceAssignmentSchema, 'serviceAssignments')

export default ServiceAssignment