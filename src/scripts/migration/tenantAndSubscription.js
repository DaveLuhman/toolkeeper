export async function createTenantAndSubscription(db) {
    // Create a new tenant for the customer
    const newTenant = await db.collection('tenants').insertOne({
        name: 'New Customer Tenant',
        domain: 'newcustomer.com',
        adminUser: null, // You can link the admin user here later
        updatedOn: new Date(),
    });

    console.log('Tenant created with ID:', newTenant._id);

    // Create a new subscription for this tenant
    const newSubscription = await db.collection('subscriptions').insertOne({
        user: null, // Will be linked to a user later
        tenant: newTenant._id,
        status: 'active',
        plan: 'annual',
        lemonSqueezyId: 'manual-subscription-id',
        lemonSqueezyObject: {}, // Fill in as needed
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Update tenant with subscription ID
    await db.collection('tenants').updateOne(
        { _id: newTenant._id },
        { $set: { subscription: newSubscription._id } }
    );

    console.log('Subscription created and linked to tenant.');

    return newTenant._id; // Return the tenant ID to use in other migrations
}


// src\scripts\migration\tenantAndSubscription.js
