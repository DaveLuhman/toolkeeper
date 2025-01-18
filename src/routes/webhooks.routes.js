import { Router } from "express";
import handleWebhookEvent from "../controllers/webhook.js";

const webhookRouter = new Router();

webhookRouter.post("/subscription", handleWebhookEvent);

export default webhookRouter;
// src\routes\webhooks.routes.js
