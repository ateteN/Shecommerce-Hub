const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 

const connectDB = require("./config/db");
connectDB(); 

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/community', require('./routes/community'));

// Root
app.get('/', (req, res) => {
  res.send('She-Commerce Hub Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
