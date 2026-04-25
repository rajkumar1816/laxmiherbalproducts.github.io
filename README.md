# Lakshmi Herbal Products - Complete Website

A fully responsive herbal products website with admin panel for content management.

## ✨ Features
- ✅ Responsive design (mobile-first)
- ✅ Home, Products, Ingredients, About, Contact pages
- ✅ WhatsApp ordering integration
- ✅ Admin panel (Add/Edit/Delete products, upload images)
- ✅ MongoDB database
- ✅ Secure admin login (JWT)
- ✅ Smooth animations & modern UI
- ✅ Herbal green theme

## 📁 Folder Structure
```
lakshmi-herbal-products/
├── frontend/          # Static HTML/CSS/JS
│   ├── index.html     # Home page
│   ├── admin.html     # Admin panel
│   ├── style.css      # Main styles
│   ├── admin-style.css
│   ├── script.js
│   └── admin-script.js
├── uploads/           # Product images (auto-created)
├── server.js          # Express backend
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas free tier](https://www.mongodb.com/atlas))

### 2. Setup
```bash
cd "C:\Users\AMARNATH REDDY\Desktop\lakshmi-herbal-products"
copy .env.example .env
```

**Update `.env`:**
```
MONGODB_URI=mongodb://localhost:27017/lakshmiherbal
# OR MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/lakshmiherbal
JWT_SECRET=your_very_secure_secret_key_here
```

**WhatsApp number:** Update `https://wa.me/919876543210` in `script.js` with real number.

### 3. Install & Run
```bash
npm install
npm start
```

✅ Server runs on `http://localhost:3000`

### 4. Admin Access
```
Username: admin
Password: admin123
```
Visit: `http://localhost:3000/admin.html`

## 🛠️ Admin Panel
1. **Login** → Default credentials above
2. **Add Product** → Fill form + upload image → Save
3. **Edit** → Click edit button on table row
4. **Delete** → Click delete button (confirm)
5. **Live Updates** → Changes appear instantly on frontend!

## 📱 WhatsApp Ordering
- All "Order Now" buttons open WhatsApp with pre-filled message
- Update phone number in `script.js` line with `wa.me/`

## 🎨 Customization
```
Colors: #4CAF50 (green), #F5F5DC (beige)
Fonts: Poppins (Google Fonts)
Icons: Font Awesome 6
```

**Edit content:**
- Products via Admin Panel (no code needed!)
- Text/colors: Edit HTML/CSS
- Ingredients: Edit `index.html` ingredients section

## 🔧 MongoDB Setup (Optional Local)
```bash
# Install MongoDB Community Server
# Windows: Download from mongodb.com
# Run: mongod
```

## 📱 Mobile Preview
✅ Fully responsive
✅ Hamburger menu
✅ Touch-friendly buttons

## 🚀 Production Deployment
```
# Heroku/Vercel/Render
1. Push to GitHub
2. MongoDB Atlas (free)
3. Set env vars
4. Deploy!
```

## 🎁 Default Content (Auto-created)
- Herbal Hair Oil (100ml ₹299, 200ml ₹549)
- Organic Hair Powder (₹199)
- Combo Pack (₹799)

## 📞 Support
WhatsApp: Update number in code
Email: lakshmiherbal@gmail.com

---

**Made with ❤️ for small herbal businesses. Easy to customize! 🌿**

