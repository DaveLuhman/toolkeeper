const migrateUsers = async (db, tenantId) => {
    const oldUsers = await db.collection('users_old').find({}).toArray();

    const newUsers = oldUsers.map((user) => ({
        ...user,
        tenant:tenantId || user.tenant  // New field
    }));

    await db.collection('users').insertMany(newUsers);
    console.log('Users migrated successfully.');
};

export default migrateUsers
// src\scripts\migration\user.js
