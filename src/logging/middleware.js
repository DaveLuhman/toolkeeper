import { Log } from "../models/index.models.js";
import logger from "./index.js";

const tenantLogger = (req, res, next) => {
	const tenantId = req?.user?.tenant.valueOf() || "unknown";

	req.logger = logger.child({ tenantId });

	req.logger.info({
		message: `Incoming request: ${req.method} ${req.url}`,
		metadata: { userId: req?.user?._id || "guest" },
	});
	res.on('finish', () => {
		// Log the separator after response completion
		req.logger.info({
		  message: '--- End of Request ---',
		  metadata: { url: req.originalUrl, method: req.method }
		})})

	next();
};

export const renderLogView = async (req, res, next) => {
	try {
		let logs;

		// Check if the user is Superadmin
		if (req.user.role === "Superadmin") {
			// Fetch all logs if the user is Superadmin
			logs = await Log.find().sort({ timestamp: -1 }).lean();
			req.logger.info({
				message: "Superadmin accessed all logs",
				metadata: { userId: req.user._id },
			});
		} else {
			// Fetch logs for the current tenant
			const tenantId = req.user.tenant._id;
			logs = await Log.find({ tenantId }).sort({ timestamp: -1 }).lean();
			req.logger.info({
				message: "Tenant logs accessed",
				metadata: { tenantId: req.user.tenant._id, userId: req.user._id },
			});
		}

		res.render("logs", { logs, tenant: req.user.tenant });
	} catch (error) {
		req.logger.error({
			message: "Failed to fetch logs",
			metadata: { userId: req.user._id, role: req.user.role },
			error: error.message,
		});
		res.status(500).send("Unable to fetch logs.");
	}
};

export default tenantLogger;
