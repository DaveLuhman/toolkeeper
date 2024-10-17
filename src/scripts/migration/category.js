 const migrateCategory = async (db, tenant) => {
    const oldCategories = await db.collection('categories_old').find({}).toArray();

    const newCategories = oldCategories.map((category) => ({
        ...category,
        tenant,
    }));

    await db.collection('categories').insertMany(newCategories);
    console.log('Categories migrated successfully.');
};

export default migrateCategory
// file: src\scripts\migration\category.js
