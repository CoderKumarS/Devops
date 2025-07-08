const fs = require('fs');
const path = require('path');
// middleware that is specific to this router
const logFilePath = path.join(__dirname, 'logs.log');

const timeLog = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const duration = process.hrtime(start);
        const ms = (duration[0] * 1e3 + duration[1] / 1e6).toFixed(2);
        const now = new Date();
        const logMessage =
            `Date: ${now.toLocaleDateString()} Time: ${now.toLocaleTimeString()} | ` +
            `Method: ${req.method} | Route: ${req.originalUrl} | ` +
            `Status: ${res.statusCode} | IP: ${req.ip} | Duration: ${ms}ms\n`;
        console.log(logMessage.trim());
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write log:', err);
            }
        });
    });
    next();
}

module.exports = timeLog;