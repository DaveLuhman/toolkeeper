
const request = require('supertest');
import { app, server } from '../server'; // Assuming your Express app is exported from server.js
const { Subscription, User, Tenant } = require('../models/index.models.js');

describe('Webhook Event: subscription_created', () => {
    it('should create a new user, tenant, subscription, and send a welcome email', async () => {
        const subscriptionData = {
            id: 'sub_test_123',
            attributes: {
                user_name: 'John Doe',
                user_email: 'john.doe@example.com',
            },
        };

        const webhookPayload = {
            type: 'subscription_created',
            data: subscriptionData,
        };

const response = await request(app)
            .post('/webhook') // Assuming your webhook endpoint is /webhook
            .set('X-Signature', 'valid_signature') // Mock a valid signature
            .send(webhookPayload);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Subscription created, user and tenant created, and welcome email sent.');

        // Verify that the user, tenant, and subscription were created
        const user = await User.findOne({ email: 'john.doe@example.com' });
        expect(user).not.toBeNull();

        const tenant = await Tenant.findOne({ adminUser: user._id });
        expect(tenant).not.toBeNull();

        const subscription = await Subscription.findOne({ lemonSqueezyId: 'sub_test_123' });
        expect(subscription).not.toBeNull();
    });
});
