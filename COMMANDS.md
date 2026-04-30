# FulxerPro - Complete Setup Commands

## Prerequisites
- Node.js v14+ installed
- MongoDB (local or MongoDB Atlas)
- Git (optional)

---

## Step-by-Step Commands

### 1. Install Dependencies

```bash
# Navigate to frontend folder
cd "fulxer termites"

# Install all packages
npm install

# Add React Router if not already installed
npm install react-router-dom@6.20.0

# Go back to root
cd ..

# Navigate to backend folder
cd backend

# Install all packages
npm install

# Go back to root
cd ..
```

**Expected output**: Both should say "added X packages" without errors

---

### 2. Set Up MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service
# Windows - MongoDB should be installed as service
# Mac - If using Homebrew:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Recommended for Production)**

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env` with connection string

---

### 3. Configure Environment Variables

**Frontend Configuration** (`fulxer termites/.env.local`):
```bash
# Create file
cd "fulxer termites"
echo VITE_API_URL=http://localhost:5000 > .env.local
cd ..
```

**Backend Configuration** (`backend/.env`):
```bash
# Create file
cd backend
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo MONGODB_URI=mongodb://localhost:27017/fulxerpro >> .env
echo JWT_SECRET=your_jwt_secret_key_change_this >> .env
echo JWT_EXPIRE=30d >> .env
cd ..
```

Or manually create the files with the content above.

---

### 4. Start Backend Server

```bash
# Navigate to backend
cd backend

# Start development server
npm run dev

# Expected output:
# Server running on port 5000 in development mode
```

**Keep this terminal open!**

---

### 5. Start Frontend Server (New Terminal)

```bash
# Navigate to frontend
cd "fulxer termites"

# Start development server
npm run dev

# Expected output:
# VITE v4.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

## 6. Test the Application

### Option A: Browser
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Login and verify dashboard works

### Option B: Command Line (cURL)

```bash
# Test backend health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@test.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password123"}'
```

---

## 7. Create Admin User (Optional)

```bash
# Create file: backend/create-admin.js
cat > backend/create-admin.js << 'EOF'
import mongoose from 'mongoose';
import User from './models/User.js';
import config from './config.js';

mongoose.connect(config.MONGODB_URI);

const createAdmin = async () => {
  try {
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
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
EOF

# Run it
cd backend
node create-admin.js
cd ..
```

---

## Common Commands

### Clean Install (If Something Breaks)

```bash
# Frontend
cd "fulxer termites"
rm -rf node_modules package-lock.json
npm install
npm install react-router-dom

# Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
```

### Check if Ports are Free

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5000
lsof -i :5173
```

### Kill Process Using Port

```bash
# Windows (replace 12345 with actual PID)
taskkill /PID 12345 /F

# Mac/Linux (replace 12345 with actual PID)
kill -9 12345
```

### Check MongoDB Connection

```bash
# Test connection
mongo mongodb://localhost:27017/fulxerpro

# Or use MongoDB Compass GUI:
# Download from: https://www.mongodb.com/products/tools/compass
```

---

## Production Build

### Build Frontend for Production

```bash
cd "fulxer termites"

# Create optimized build
npm run build

# This creates a 'dist' folder
# Deploy this folder to Vercel, Netlify, or your server
```

### Deploy Backend

```bash
cd backend

# Set NODE_ENV to production
# Update .env with production values
NODE_ENV=production
MONGODB_URI=mongodb+srv://...production...
JWT_SECRET=your-production-secret-key

# Deploy to:
# - Heroku
# - Railway
# - AWS EC2
# - DigitalOcean
```

---

## Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] API health check returns success
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Admin panel accessible with admin account

---

## File Locations Summary

```
Frontend .env:    fulxer termites/.env.local
Backend .env:     backend/.env
Frontend src:     fulxer termites/src/
Backend api:      backend/routes/
Database models:  backend/models/
```

---

## Useful URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Admin Panel: http://localhost:5173/admin
- User Dashboard: http://localhost:5173/dashboard

---

## Next Steps After Running

1. **Test authentication**
   - Create account
   - Login
   - Check token in browser LocalStorage

2. **Test admin panel**
   - Create user with admin role
   - Access /admin
   - Manage users

3. **Integrate AWS services** (optional)
   - API Gateway
   - S3 bucket
   - RDS (if replacing MongoDB)

4. **Customize**
   - Update colors in tailwind.config.js
   - Add company logo
   - Modify company name
   - Add your content

5. **Deploy**
   - Frontend to Vercel/Netlify
   - Backend to Heroku/Railway/AWS
   - Update .env.production
   - Configure domain

---

## Troubleshooting Quick Links

- **Port already in use**: See "Check if Ports are Free" section
- **MongoDB not connecting**: See "Check MongoDB Connection" section
- **API not responding**: Verify backend is running
- **Frontend not loading**: Verify frontend is running on port 5173
- **Login not working**: Check .env.local has correct API_URL

---

## Success!

If you've completed all steps above, your FulxerPro platform is running and ready to use! 🎉

**Next time you want to run the servers:**

Terminal 1:
```bash
cd backend && npm run dev
```

Terminal 2:
```bash
cd "fulxer termites" && npm run dev
```

Then open http://localhost:5173

---

**Happy coding! 🚀**
