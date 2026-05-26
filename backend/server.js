require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

app.listen(PORT, () => {
  console.log(`DeskFlow API running on port ${PORT}`);
});
