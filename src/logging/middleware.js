const tenantLogger = (req, res, next) => {
    const tenantId = req.session?.user?.tenant?._id || 'unknown';

    req.logger = logger.child({ tenantId });

    req.logger.info({
      message: `Incoming request: ${req.method} ${req.url}`,
      metadata: { userId: req.session?.user?._id || 'guest' },
    });

    next();
  };

  export default tenantLogger