const migrateServiceAssignments = async (db, tenant) => {
    const oldAssignments = await db.collection('serviceassignments_old').find({}).toArray();

    const newAssignments = oldAssignments.map((assignment) => ({
        ...assignment,
        tenant
    }));

    await db.collection('serviceassignments').insertMany(newAssignments);
    console.log('ServiceAssignments migrated successfully.');
};

export default migrateServiceAssignments
// src\scripts\migration\serviceAssignment.js
