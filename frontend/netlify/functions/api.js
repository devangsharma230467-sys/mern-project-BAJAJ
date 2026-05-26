const serverless = require('serverless-http');
const app = require('../../../backend/src/app');
const { connectDB } = require('../../../backend/src/config/db');

// Connect to the database
connectDB();

module.exports.handler = serverless(app);
