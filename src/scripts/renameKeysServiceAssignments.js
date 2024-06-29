import mongoose from 'mongoose';

// MongoDB models
import ServiceAssignment from '../models/ServiceAssignment.model.js';

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to rename keys in ServiceAssignment documents
const renameKeysInServiceAssignments = async () => {
  try {
    // Fetch all ServiceAssignment documents
    const serviceAssignments = await ServiceAssignment.find({});

    // Iterate over each document and update the keys
    for (const assignment of serviceAssignments) {
      const updated = await ServiceAssignment.findByIdAndUpdate(assignment._id, {
        $rename: {
          'name': 'jobNumber',
          'description': 'jobName'
        }
      }, { new: true }); // Return the updated document

      console.log(`Updated document: ${updated}`);
    }

    console.log('All documents have been updated successfully.');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Run the script
renameKeysInServiceAssignments();