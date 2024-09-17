const createTenantAndSubscription = async (db) => {
    // Create a new tenant for the customer
    const newTenant = await db.collection('tenants').insertOne({
        name: 'New Customer Tenant',
        domain: 'newcustomer.com',
        adminUser: null,     // You can link the admin user here later
        expiresOn: new Date('2025-10-01'),
        updatedOn: new Date(),
    });

    console.log('Tenant created with ID:', newTenant.insertedId);

    // Create a new subscription for this tenant
    const newSubscription = await db.collection('subscriptions').insertOne({
        user: null,  // Will be linked to a user later
        tenant: newTenant.insertedId,
        status: 'active',
        plan: 'annual',
        lemonSqueezyId: 'manual-subscription-id',
        lemonSqueezyObject: {},  // Fill in as needed
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Update tenant with subscription ID
    await db.collection('tenants').updateOne(
        { _id: newTenant.insertedId },
        { $set: { subscription: newSubscription.insertedId } }
    );

    console.log('Subscription created and linked to tenant.');

    return newTenant.insertedId;  // Return the tenant ID to use in other migrations
};

const tenantId = await createTenantAndSubscription(db);

// src\scripts\migration\tenantAndSubscription.js
