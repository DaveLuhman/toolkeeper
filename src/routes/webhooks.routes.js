import  { Router } from "express";
import  handleWebhookEvent  from "../middleware/subscription.js";

const webhookRouter = new Router()

webhookRouter.post('/annual', handleWebhookEvent)

export default webhookRouter
// src\routes\webhooks.routes.js
