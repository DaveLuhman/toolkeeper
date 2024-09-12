import { Router } from "express";
import { subscriptionCreatedWebhookHandler } from "../middleware/subscription";

const webhookRouter = new Router()

webhookRouter.post('/annual', subscriptionCreatedWebhookHandler)

export default webhookRouter