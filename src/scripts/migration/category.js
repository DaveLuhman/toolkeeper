import { Category } from "../../models/index.models.js";
import mongoose from "mongoose";
const migrateCategory = async (tenant) => {
    const oldCategories = await Category.find({})
    await mongoose.connection.collection('categories').rename('categories_old');
    for (const category of oldCategories) {
        category.tenant = tenant;
    }

    await Category.insertMany(oldCategories);
    console.log('Categories migrated successfully.');
};

export default migrateCategory
// file: src\scripts\migration\category.js
