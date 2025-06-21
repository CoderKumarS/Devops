const express = require('express');
const app = express();
const main = require('./routes/app');
const userRoutes = require('./routes/user');
const fs = require('fs');
const path = require('path');
// middleware that is specific to this router
const logFilePath = path.join(__dirname, 'logs.txt');

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
app.use(timeLog);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', main);
app.use('/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});