// Lakshmi Herbal Products - Backend Server
// Node.js + Express + MongoDB with Admin Panel

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'lakshmiherbal_secret_key_change_this';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshmiherbal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  image: String,
  category: String
});
const Product = mongoose.model('Product', productSchema);

// Admin User Schema (hardcoded for simplicity)
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model('Admin', adminSchema);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to verify admin
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin CRUD Products
app.post('/api/admin/products', verifyToken, upload.single('image'), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    category: req.body.category || 'hair-oil'
  });
  await product.save();
  res.json(product);
});

app.put('/api/admin/products/:id', verifyToken, upload.single('image'), async (req, res) => {
  const updates = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category || 'hair-oil'
  };
  if (req.file) updates.image = `/uploads/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(product);
});

app.delete('/api/admin/products/:id', verifyToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.get('/api/admin/products', verifyToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create default admin if not exists
async function createDefaultAdmin() {
  const defaultUsername = 'admin';
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  const existing = await Admin.findOne({ username: defaultUsername });
  if (!existing) {
    await Admin.create({ username: defaultUsername, password: defaultPassword });
    console.log('Default admin created: username=admin, password=admin123');
  }
}

mongoose.connection.on('connected', createDefaultAdmin);

// Seed default products
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const defaultProducts = [
      {
        name: 'Herbal Hair Oil 100ml',
        price: '₹299',
        description: '100% natural hair oil with curry leaves, hibiscus & coconut oil for hair growth.',
        image: '/uploads/herbal-hair-oil-100ml.jpg',
        category: 'hair-oil'
      },
      {
        name: 'Herbal Hair Oil 200ml',
        price: '₹549',
        description: 'Premium hair oil for intense nourishment & dandruff control.',
        image: '/uploads/herbal-hair-oil-200ml.jpg',
        category: 'hair-oil'
      },
      {
        name: 'Organic Hair Powder',
        price: '₹199',
        description: 'Fenugreek & amla powder for weekly hair packs.',
        image: '/uploads/organic-hair-powder.jpg',
        category: 'powder'
      },
      {
        name: 'Combo Pack',
        price: '₹799',
        description: 'Hair Oil 100ml + Powder - Save 20%',
        image: '/uploads/combo-pack.jpg',
        category: 'combo'
      }
    ];
    await Product.insertMany(defaultProducts);
    console.log('Default products seeded.');
  }
}

mongoose.connection.on('connected', seedProducts);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Admin: username=admin, password=admin123');
  console.log('WhatsApp Order: +91-XXXXXXXXXX (update in frontend)');
});

