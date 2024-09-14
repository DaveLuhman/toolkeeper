import { Subscription, User, Tenant } from '../models/index.models.js'; // Subscription model
import { generatePassword } from '../middleware/tenant.js'; // Password generation utility
import { getDomainFromEmail, sendEmail } from '../controllers/util.js'; // Email utility
import { annualWebhookSignature } from '../config/lemonSqueezy.js'; // Signature for webhook verification

// Utility function to generate ToolKeeper instance URL
const getInstanceUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? 'https://toolkeeper.site'
        : 'https://dev.toolkeeper.site';
};

const subscriptionCreatedWebhookHandler = async (req, res, next) => {
    // Verify the X-Signature header from LemonSqueezy
    if (req.headers['X-Signature'] !== annualWebhookSignature) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        const subscriptionData = req.body.data; // Extract subscription data from the request
        const userId = subscriptionData?.attributes?.user_id; // Assuming user_id is part of the webhook payload

        // Find the pending user based on userId
        const pendingUser = await User.findById(userId);

        if (!pendingUser || pendingUser.status !== 'pending') {
            return res.status(404).json({ error: 'Pending user not found or already active.' });
        }

        // Create the tenant using the Tenant model's static method (assuming tenantName is passed in subscription data)
        const tenantData = {
            name: subscriptionData?.attributes?.company_name || `${pendingUser.firstName}'s Tenant`,
            domain: getDomainFromEmail(pendingUser.email),
            adminUser: pendingUser._id, // Assign the admin user to the tenant
        };
        const tenant = await Tenant.createWithDefaults(tenantData);

        // Create a new subscription entry
        await Subscription.create({
            userId: pendingUser._id,
            tenantId: tenant._id,
            status: 'active', // Set subscription as active
            lemonSqueezyId: subscriptionData.id, // Use subscription ID from webhook
            lemonSqueezyObject: subscriptionData.attributes, // Store full subscription details
        });

        // Update the user's status to active and assign the tenant to the user
        pendingUser.status = 'active';
        pendingUser.tenant = tenant._id;

        // Generate a password for the user
        const newPassword = generatePassword();

        // Update the user's password
        pendingUser.password = newPassword; // Password will be hashed by User schema's setter
        await pendingUser.save();

        // Prepare and send the welcome email
        const instanceUrl = getInstanceUrl();
        const emailSubject = 'Welcome to ToolKeeper!';
        const emailBody = `Dear ${pendingUser.firstName},\n\nYour ToolKeeper account has been created successfully. Your login credentials are:\n\nEmail: ${pendingUser.email}\nPassword: ${newPassword}\n\nPlease log in to your account at ${instanceUrl} and change your password immediately.\n\nBest regards,\nThe ToolKeeper Team`;

        await sendEmail(pendingUser.email, emailSubject, emailBody);

        // Send success response to the webhook
        res.status(200).json({ message: 'Subscription created, tenant assigned, and user updated.' });
    } catch (error) {
        console.error('Error processing subscription webhook:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export { subscriptionCreatedWebhookHandler };
