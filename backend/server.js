const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/content', require('./routes/content'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/products', require('./routes/reviews'));
app.use('/api/admin', require('./routes/adminStats'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/corevita';
mongoose.connect(MONGO_URI)
  .then(() => { console.log('MongoDB connected'); require('./seedData')(); })
  .catch(err => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));