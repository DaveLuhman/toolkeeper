const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://mongo.dev.ado.lan:27017';

// Database Name
const dbName = 'toolkeeper';

// Collection Name
const collectionName = 'serviceassignments';

// Update keys
const updateKeys = async () => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Update documents
        await collection.updateMany({}, { $rename: { "name": "jobNumber", "description": "jobName" } });

        console.log('Keys updated successfully');

        // Close the connection
        client.close();
    } catch (error) {
        console.error('Error updating keys:', error);
    }
};

// Call the updateKeys function
updateKeys();