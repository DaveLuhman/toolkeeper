import mongoose from 'mongoose';
import Tool from '../models/Tool.model.js';
// skipcq: JS-0128 - imported to satisfy autopopulate on tool schema
import ServiceAssignment from '../models/ServiceAssignment.model.js';
// skipcq: JS-0128 - imported to satisfy autopopulate on tool schema
import Category from '../models/Category.model.js';
import 'dotenv/config'
import process from "node:process";
// Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Updates the tool counts for tools.
 */
async function checkToolUpdatedAt() {
  try {
    // Get all tools
    const tools = await Tool.find({updatedAt: { $type: 'double' }});
    
    for (const tool of tools) {
      // Count the number of tools assigned to each service assignment
        const updatedAt = new Date(tool.updatedAt);
        tool.updatedAt = updatedAt;
        console.log('Previous value', updatedAt);
        console.log('New value', tool.updatedAt);
        await tool.save();
    }

    console.log('Tool updatedAt values have been updated successfully');
  } catch (error) {
    console.error('Error updating tool counts:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
checkToolUpdatedAt();
// src\scripts\validateTimestampsAsDates.js
