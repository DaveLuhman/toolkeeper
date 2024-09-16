const migrateUsers = async (db, tenantId) => {
    const oldUsers = await db.collection('users_old').find({}).toArray();

    const newUsers = oldUsers.map((user) => ({
        ...user,
        tenant: user.tenant || tenantId,  // New field
    }));

    await db.collection('users').insertMany(newUsers);
    console.log('Users migrated successfully.');
};

export default migrateUsers