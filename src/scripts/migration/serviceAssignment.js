const migrateServiceAssignments = async (db) => {
    const oldAssignments = await db.collection('serviceassignments_old').find({}).toArray();

    const newAssignments = oldAssignments.map((assignment) => ({
        ...assignment,
        phone: assignment.phone || '',       // New field
        toolCount: assignment.toolCount || 0, // New field
        notes: assignment.notes || '',       // New field
    }));

    await db.collection('serviceassignments').insertMany(newAssignments);
    console.log('ServiceAssignments migrated successfully.');
};

export default migrateServiceAssignments