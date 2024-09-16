 const migrateTools = async (db) => {
    const oldTools = await db.collection('tools_old').find({}).toArray();

    const newTools = oldTools.map((tool) => ({
        ...tool,
        archived: tool.archived || false,  // New field
        status: tool.status || 'active',   // New field
    }));

    await db.collection('tools').insertMany(newTools);
    console.log('Tools migrated successfully.');
};

export default migrateTools