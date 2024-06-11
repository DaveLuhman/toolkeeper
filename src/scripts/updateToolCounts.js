import mongoose from 'mongoose';
import Tool from '../models/Tool.model.js';
import ServiceAssignment from '../models/ServiceAssignment.model.js';

// Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Updates the tool counts for service assignments.
 */
async function updateToolCounts() {
  try {
    // Get all service assignments
    const serviceAssignments = await ServiceAssignment.find({});
    
    for (const assignment of serviceAssignments) {
      // Count the number of tools assigned to each service assignment
      const toolCount = await Tool.countDocuments({ serviceAssignment: assignment?._id });

      // Update the toolCount field of the service assignment
      assignment.toolCount = toolCount;
      await assignment.save();
    }

    console.log('Tool counts have been updated successfully');
  } catch (error) {
    console.error('Error updating tool counts:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
updateToolCounts();