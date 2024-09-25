 const migrateCategory = async (db, tenant) => {
    const oldCategories = await db.collection('categories').find({}).toArray();

    const newCategories = oldCategories.map((assignment) => ({
        ...assignment,
        toolCount: 0, // New field
        tenant,
    }));

    await db.collection('categories').insertMany(newCategories);
    console.log('Categories migrated successfully.');
};

export default migrateCategory
// file: src\scripts\migration\category.js
