// dev depenancies
// eslint-disable-next-line no-unused-vars
import colors from "colors";
import "dotenv/config";
// db depenancies
import connectMongoDBSession from "connect-mongodb-session";
import connectDB from "./config/db.js";
// express depenancies
import cookieParser from "cookie-parser";
import csurf from "csurf";
import express from "express";
import fileUpload from "express-fileupload";
import flash from "express-flash";
import session from "express-session";
// handlebars depenancies
import { create } from "express-handlebars"; // templating engine
// auth depenancies
import passport from "passport";
import { checkAuth, isManager } from "./middleware/auth.js";
import passportConfig from "./config/passport.js";
// utility depenancies

import {
	populateDropdownItems,
	rateLimiter,
	errorHandler,
	AppError,
	getBaseUrl,
} from "./middleware/util.js";
// routers
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { indexRouter } from "./routes/index.routes.js";
import { settingsRouter } from "./routes/settings/index.routes.js";
import { toolRouter } from "./routes/tool.routes.js";
import { userRouter } from "./routes/user.routes.js";
import docsRouter from "./routes/docs.routes.js";
import customHelpers from "./helpers/index.js";
import { applyImpersonation } from "./middleware/tenant.js";
import webhookRouter from "./routes/webhooks.routes.js";
import bodyParser from "body-parser";
import tenantLogger from "./logging/middleware.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MongoDBStore = connectMongoDBSession(session);
const PORT = process.env.PORT || 5000;
export const app = express(); // Create Express App

app.use(errorHandler);
await connectDB(); // Connect to MongoDB and report status to console
// create mongo store for session persistence
const mongoStore = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});
// Configure session options
const sessionConfig = {
	secret: process.env.SECRET_KEY,
	resave: true,
	saveUninitialized: false,
	cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
};
// If in production, use secure cookies and mongo store
if (process.env.NODE_ENV === "production") {
	sessionConfig.cookie = {
		secure: true,
		httpOnly: false,
		maxAge: 1000 * 60 * 60 * 24,
		sameSite: true,
	};
	sessionConfig.store = mongoStore;
}

// Handlebars Setup
const hbs = create({
	helpers: customHelpers,
	extname: ".hbs",
	defaultLayout: "main",
	partialsDir: ["./src/views/partials", "./src/views/partials/modals"],
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./src/views");
app.set("trust proxy", 1);

// Express Middleware
app.use(cookieParser());
if (process.NODE_ENV === "PRODUCTION") {
	app.use(csurf({ cookie: true }));
} // Cross Site Request Forgery protection middleware

// Add this middleware before express.static
app.use((req, res, next) => {
	if (req.path.endsWith(".js")) {
		res.setHeader("Content-Type", "application/javascript");
	}
	next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
// Middleware to capture the raw body for /webhooks route
app.use("/webhooks", bodyParser.raw({ type: "*/*" }), (req, res, next) => {
	req.rawBody = req.body; // Capture the raw body buffer
	next();
});
app.use("/webhooks", bodyParser.json(), webhookRouter);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded values
app.use(session(sessionConfig));
app.use(flash());
// Passport
passportConfig(app);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter);
app.use(getBaseUrl);
app.use(tenantLogger);
// Routes (No User Context)
app.use("/", indexRouter);
app.use("/docs", docsRouter);
// Routes (User Context)
app.use(checkAuth);
app.use(applyImpersonation);
app.use(populateDropdownItems);
app.use("/user", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/tool", toolRouter);
// Routes (Manager Context)
app.use(isManager);
app.use("/settings", settingsRouter);
// catch 404 and forward to error handler
app.use((_req, res, next) => {
	next(new AppError("Not Found", 404));
});
app.use(errorHandler);

const server = app.listen(PORT, () => {
	console.info(
		`[INIT] Server is running at http://localhost:${PORT}`.bgWhite.black,
	);
});

export default { app, server };

// src\server.js
