import { Router } from "express";
import {
	renderDocsPage,
	renderFaqPage,
	renderGettingStartedPage,
	renderServiceAssignmentPage,
	renderToolManagementPage,
} from "../controllers/docs.js";

const docsRouter = Router();

docsRouter.get("/", renderDocsPage);
docsRouter.get("/faq", renderFaqPage);
docsRouter.get("/getting-started", renderGettingStartedPage);
docsRouter.get("/toolManagement", renderToolManagementPage);
docsRouter.get("/serviceAssignment", renderServiceAssignmentPage);

export default docsRouter;
