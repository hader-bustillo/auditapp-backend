function healthCheckRoute(_req, res, _next) {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        responsetime: process.hrtime(),
        timestamp: Date.now(),
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
}

module.exports = { healthCheckRoute };
