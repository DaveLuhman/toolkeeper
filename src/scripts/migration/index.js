import migrateTools from "./tool.js";
import migrateServiceAssignments from "./serviceAssignment.js";
import migrateCategory from './category.js'

const migrateCollections = async (db) => {
    await db.collection('tools').rename('tools_old');
    await db.collection('serviceassignments').rename('serviceassignments_old');
    await db.collection('tenants').rename('tenants_old');
    await db.collection('subscriptions').rename('subscriptions_old');
    await db.collection('users').rename('users_old');
    await db.collection('pendingusers').rename('pendingusers_old');
    console.log('Existing collections renamed successfully.');
};





// src\scripts\migration\index.js
