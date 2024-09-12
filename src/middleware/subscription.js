import { annualWebhookSignature } from "../config/lemonSqueezy";
import { Subscription } from "../models/index.models";

export const subscriptionCreatedWebhookHandler = async (req, res, next) => {
    if( req.headers["X-Signature"] !== annualWebhookSignature) return next({status:"401", message:"You are not authorized to access this resource"})
    try {
        const newSubscription = await Subscription.create()
    } catch (error) {
        return next(error)
    }
    // TODO @DaveLuhman This is where you left off. 
}