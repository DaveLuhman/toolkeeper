import { Router } from "express";
import { renderDocsPage, renderFaqPage, renderGettingStartedPage } from "../controllers/docs";

const docsRouter = Router();

docsRouter.get('/', renderDocsPage);
docsRouter.get('/faq', renderFaqPage);
docsRouter.get('/getting-started', renderGettingStartedPage);

export default docsRouter;