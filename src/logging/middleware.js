import logger from "./index.js";

const tenantLogger = (req, res, next) => {
	const tenantId = req?.user?.tenant.valueOf() || "unknown";

	req.logger = logger.child({ tenantId });

	req.logger.info({
		message: `Incoming request: ${req.method} ${req.url}`,
		metadata: { userId: req?.user?._id || "guest" },
	});

	next();
};

export default tenantLogger;
