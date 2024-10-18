import { ServiceAssignment } from "../../models/index.models.js";
import mongoose from "mongoose";

const migrateServiceAssignments = async (tenant) => {
    console.log('Migrating Service Assignments...');
    const oldAssignments = await ServiceAssignment.find({})
    await mongoose.connection.collection("serviceassignments").rename("serviceassignments_old");
    for (const assignment of oldAssignments) {
        assignment.tenant = tenant;
    }
    await ServiceAssignment.insertMany(oldAssignments);
    console.log('ServiceAssignments migrated successfully.');
};

export default migrateServiceAssignments
// src\scripts\migration\serviceAssignment.js
