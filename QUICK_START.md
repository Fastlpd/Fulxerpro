# FulxerPro - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+ installed
- MongoDB (local or MongoDB Atlas)
- Git

### Step 1: Clone & Install Dependencies

```bash
# Frontend
cd "fulxer termites"
npm install
npm install react-router-dom

# Backend (in new terminal)
cd backend
npm install
```

### Step 2: Configure MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fulxerpro
```

### Step 3: Start the Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd "fulxer termites"
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Test the Application

1. Open http://localhost:5173 in browser
2. Click "Sign Up" button
3. Create an account
4. Login with your credentials
5. Access your dashboard

---

## 📋 Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/signin` | Login page |
| `/signup` | Registration page |
| `/dashboard` | User dashboard |
| `/admin` | Admin panel |

---

## 👤 Test Accounts

After seeding the database:

**Admin Account**:
- Email: `admin@fulxerpro.com`
- Password: `admin123`

**Demo User**:
- Email: `demo@fulxerpro.com`
- Password: `demo123`

---

## 🔑 Create Admin Account

Run in backend directory:
```javascript
// Create a new file: backend/create-admin.js
import mongoose from 'mongoose';
import User from './models/User.js';
import config from './config.js';

mongoose.connect(config.MONGODB_URI);

const createAdmin = async () => {
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fulxerpro.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  });
  console.log('Admin created:', admin.email);
  process.exit();
};

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
```

Run: `node create-admin.js`

---

## 🔌 API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "FulxerPro API is running",
  "timestamp": "2024-01-26T10:30:00.000Z"
}
```

---

## 📱 Features Ready

✅ **Landing Page**
- Hero section with animations
- Features showcase
- Investment plans
- Market categories
- Testimonials
- Responsive design

✅ **Authentication**
- User registration
- User login
- JWT tokens
- Secure passwords

✅ **User Dashboard**
- Profile overview
- Investment balance
- Portfolio view

✅ **Admin Panel**
- User management
- User editing
- User deletion
- Statistics

---

## 🌐 AWS Integration (Optional)

### Connect API Gateway

Update `fulxer termites/.env.local`:
```
VITE_API_URL=https://your-api-gateway.execute-api.region.amazonaws.com/stage
```

### Upload to S3

Add to backend environment:
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

---

## 📦 Build for Production

**Frontend**:
```bash
cd "fulxer termites"
npm run build
# Generates dist/ folder
```

**Backend**:
```bash
# No build needed, deploy as is
# Set NODE_ENV=production in .env
```

---

## 🆘 Common Issues

**Port 5000 already in use**:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**MongoDB connection error**:
- Check if MongoDB is running
- Verify connection string in .env
- Check IP whitelist on MongoDB Atlas

**CORS errors**:
- Backend is running on correct port
- Frontend has correct API URL in .env

---

## 📚 Documentation

See `SETUP_AND_INTEGRATION_GUIDE.md` for:
- Complete API documentation
- Database setup
- Security best practices
- Production deployment
- AWS integration details

---

## 💡 Tips

1. Use browser DevTools to inspect API requests
2. Check browser console for frontend errors
3. Check terminal for backend errors
4. Keep `.env` files secret (never commit)
5. Use different passwords in production

---

## 🎉 You're All Set!

Your FulxerPro platform is ready. Start building your investment features!

For questions or issues, refer to the main documentation or check the code comments.
