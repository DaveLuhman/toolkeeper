 const migrateTools = async (db, tenant) => {
    const oldTools = await db.collection('tools_old').find({}).toArray();
    const toolHistories = await db.collection('tool_histories').find({}).toArray();
    const newTools = oldTools.map((tool) => ({
        ...tool,
        tenant
    }));
    for(const tool of newTools) {
        const toolHistory = toolHistories.find(history => history._id === tool._id);
        tool.history = toolHistory?.history || [];
    }
    await db.collection('tools').insertMany(newTools);
    console.log('Tools migrated successfully.');
};

export default migrateTools
// src\scripts\migration\tool.js
