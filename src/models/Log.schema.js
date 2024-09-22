import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }, // Reference to tenant
  level: { type: String, enum: ['error', 'warn', 'info', 'debug'], required: true }, // Log level
  timestamp: { type: Date, default: Date.now }, // Log timestamp
  message: { type: String, required: true }, // Log message
  metadata: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: user involved in the action
    serviceAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceAssignment' }, // Optional: if tool-related
    toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }, // Optional: tool involved in the action
    action: { type: String }, // Optional: a description of the action (e.g., 'tool assigned', 'login failed')
    request: {
      method: { type: String }, // HTTP method (e.g., 'GET', 'POST')
      url: { type: String }, // Request URL
      ip: { type: String }, // Client IP
      userAgent: { type: String }, // Client browser info
    },
  },
}, {
  capped: 1024 * 1024 * 10, // 10MB cap for log collection
});
logSchema.index({ tenantId: 1, timestamp: 1 });
export default logSchema