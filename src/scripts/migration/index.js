import migrateTools from "./tool.js";
import migrateServiceAssignments from "./serviceAssignment.js";
import migrateCategory from './category.js'
import migrateUsers from './user.js'
import {connect, disconnect} from "mongoose";
let globalConn

const renameCollections = async (db) => {
    await db.collection('tools').rename('tools_old');
    await db.collection('toolhistories').rename('toolhistories_old');
    await db.collection('categories').rename('categories_old');
    await db.collection('serviceassignments').rename('serviceassignments_old');
    await db.collection('users').rename('users_old');
    console.log('Existing collections renamed successfully.');
};

async function migrateAllCollections() {
    globalConn = await connect(process.env.MONGO_URI, {
        // Adding a timeout of 30 seconds
        serverSelectionTimeoutMS: 30000,
    });
    return globalConn.then(async (db) => {
        await renameCollections(db);
        await migrateTools(db);
        await migrateServiceAssignments(db);
        await migrateCategory(db);

    // Always disconnect after the migration
    disconnect()
    console.log('All collections migrated successfully.');
    }).catch((err) => {
        console.error(err);
        disconnect()
    });

}



// src\scripts\migration\index.js
