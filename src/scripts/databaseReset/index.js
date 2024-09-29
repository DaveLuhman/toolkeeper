import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import colors from 'colors'
import path from 'node:path';
import { Tenant, Tool, ServiceAssignment, Material, Category, User } from "../../models/index.models.js";
import connectDB, { DEFAULT_CATEGORY_IDS, DEFAULT_ASSIGNMENT_IDS, DEFAULT_USER_IDS } from "../../config/db.js"; // Import default IDs

// Load environment variables from .env file
dotenv.config();

// Configure AWS SDK for Wasabi S3 storage
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-central-1',
    endpoint: 'https://s3.wasabisys.com',
    s3ForcePathStyle: true // Required for Wasabi compatibility
});

async function collectTenantDataAndUpload() {
    connectDB()
    const tenantModels = { Tool, ServiceAssignment, Material, Category, User };
    const exportedDataPerTenant = [];
    const allTenants = await Tenant.find();

    for (const tenant of allTenants) {
        const tenantData = { name: tenant.name, data: {} };

        for (const [modelName, model] of Object.entries(tenantModels)) {
            tenantData.data[modelName] = await model.find()
                .where("tenant")
                .equals(tenant._id)
                .lean();
        }

        exportedDataPerTenant.push(tenantData);
    }

    // Convert the collected data to JSON
    const jsonOutput = JSON.stringify(exportedDataPerTenant, null, 2);
    const fileName = `tenant_data_export_${new Date().toISOString()}.json`;

    // Upload the JSON data to Wasabi S3
    const params = {
        Bucket: 'ado-development-exports', // Target bucket
        Key: path.join('exports', fileName), // File path within the bucket
        Body: jsonOutput,
        ContentType: 'application/json'
    };

    return s3.upload(params).promise();
}

// Helper function to delete non-default documents
async function deleteNonDefaultDocuments() {
    // Define all default ID lists for each model
    const defaultIds = {
        Category: DEFAULT_CATEGORY_IDS,
        ServiceAssignment: DEFAULT_ASSIGNMENT_IDS,
        User: DEFAULT_USER_IDS
    };

    // Deleting documents from each model if they are not in the default ID list
    const deleteOperations = [];

    for (const [modelName, model] of Object.entries({ Tool, Category, ServiceAssignment, User })) {
        deleteOperations.push(
            model.deleteMany({ _id: { $nin: defaultIds[modelName] } }).exec()
        );
    }

    try {
        const results = await Promise.all(deleteOperations);
        console.log("Non-default documents deleted successfully.");
        results.forEach((result, index) => {
            console.log(`${Object.keys(defaultIds)[index]}: Deleted ${result.deletedCount} documents.`);
        });
    } catch (error) {
        console.error("Error deleting non-default documents:", error);
    }
}

// Execute the main function with .then() to chain the delete operation
collectTenantDataAndUpload()
    .then(() => deleteNonDefaultDocuments())
    .catch(console.error);
