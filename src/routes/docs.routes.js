import { Router } from "express";
import {
	renderDocsPage,
	renderFaqPage,
	renderGettingStartedPage,
	renderServiceAssignmentPage,
	renderToolManagementPage,
	renderCategoriesPage,
	renderUsersPage
} from "../controllers/docs.js";

const docsRouter = Router();

docsRouter.get("/", renderDocsPage);
docsRouter.get("/faq", renderFaqPage);
docsRouter.get("/getting-started", renderGettingStartedPage);
docsRouter.get("/toolManagement", renderToolManagementPage);
docsRouter.get("/serviceAssignment", renderServiceAssignmentPage);
docsRouter.get("/categories", renderCategoriesPage);
docsRouter.get("/users", renderUsersPage);

export default docsRouter;
