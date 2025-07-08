require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./database/connection');
const main = require('./routes/app');
const userRoutes = require('./routes/user');
const timeLog = require('./middleware/logger');
const app = express();

app.use(timeLog);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', main);
app.use('/users', userRoutes);

const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Optional: Handle unexpected errors
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});