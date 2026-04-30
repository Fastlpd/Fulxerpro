# FulxerPro - Complete Setup and Integration Guide

## Project Overview

FulxerPro is a comprehensive investment platform with:
- **Frontend**: React + TypeScript with Vite
- **Backend**: Node.js/Express with MongoDB
- **Authentication**: JWT-based user authentication
- **Admin Panel**: Full user management dashboard
- **AWS Integration**: Ready to connect with your existing API Gateway and S3 bucket

---

## Project Structure

```
fulxerpro/
├── fulxer termites/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── sections/
│   │   │       ├── HeroSection.tsx
│   │   │       ├── FeaturesSection.tsx
│   │   │       ├── PlansSection.tsx
│   │   │       ├── MarketCategoriesSection.tsx
│   │   │       └── TestimonialsSection.tsx
│   │   ├── App.tsx            # Main app with routing
│   │   ├── index.css
│   │   ├── App.css
│   │   └── main.tsx
│   ├── .env.local
│   ├── .env.production
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── backend/                   # Backend (Node.js + Express)
    ├── models/
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   └── admin.js
    ├── server.js
    ├── config.js
    ├── package.json
    └── .env
```

---

## Setup Instructions

### 1. Frontend Setup

```bash
cd "fulxer termites"

# Install dependencies
npm install

# Add react-router-dom if not already installed
npm install react-router-dom@6.20.0
```

**Environment Variables** (`fulxer termites/.env.local`):
```
VITE_API_URL=http://localhost:5000
```

**Run Development Server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install
```

**Environment Variables** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fulxerpro
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
```

**Prerequisites**:
- MongoDB running locally or MongoDB Atlas connection string
- Node.js v14+ installed

**Run Development Server**:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

---

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "investmentBalance": 0
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { ... }
}
```

### Admin Routes (Admin Only)

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Get User by ID
```
GET /api/admin/users/:id
Authorization: Bearer <admin_token>
```

#### Update User
```
PUT /api/admin/users/:id
Authorization: Bearer <admin_token>

{
  "firstName": "Jane",
  "investmentBalance": 5000,
  "isVerified": true,
  "role": "user"
}
```

#### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>
```

#### Get Dashboard Stats
```
GET /api/admin/stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "verifiedUsers": 120,
    "totalInvestedBalance": 500000,
    "unverifiedUsers": 30
  }
}
```

---

## AWS Integration

### Using with AWS API Gateway

1. **Create API Gateway in AWS Console**
2. **Deploy your backend to EC2 or Lambda**
3. **Update frontend environment variable**:
   ```
   VITE_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage
   ```

### Using with AWS S3

For file uploads (avatars, documents):

```javascript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (file) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file
  };
  
  return s3.upload(params).promise();
};
```

### Using with AWS RDS (Replace MongoDB)

Update backend `server.js`:

```javascript
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME
});
```

---

## Database Setup

### MongoDB

**Local Setup**:
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Create database
mongo
> use fulxerpro
```

**MongoDB Atlas (Cloud)**:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Seed Initial Admin User

Create `backend/seed.js`:

```javascript
import mongoose from 'mongoose';
import User from './models/User.js';
import config from './config.js';

mongoose.connect(config.MONGODB_URI);

const createAdmin = async () => {
  const adminExists = await User.findOne({ email: 'admin@fulxerpro.com' });
  
  if (!adminExists) {
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@fulxerpro.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('Admin user created');
  }
  
  mongoose.disconnect();
};

createAdmin();
```

Run: `node seed.js`

---

## Features Implemented

### Landing Page
- ✅ Hero section with animations
- ✅ Features showcase
- ✅ Investment plans (3 tiers)
- ✅ Market categories (Crypto, Stocks, Real Estate, Automobiles)
- ✅ Testimonials section
- ✅ Responsive header with mobile menu
- ✅ Footer with links

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Token-based authentication
- ✅ Role-based access control

### User Dashboard
- ✅ Profile overview
- ✅ Account balance display
- ✅ Investment portfolio view
- ✅ Monthly returns tracking
- ✅ Quick action buttons

### Admin Dashboard
- ✅ User management
- ✅ Edit user details
- ✅ Delete users
- ✅ Dashboard statistics
- ✅ User verification status

---

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different secrets for production
   - Rotate JWT secrets regularly

2. **Password Security**
   - Uses bcryptjs hashing (10 salt rounds)
   - Minimum 6 characters required
   - Never store plain text passwords

3. **API Security**
   - JWT token validation on protected routes
   - Admin-only routes with role verification
   - CORS configured for frontend

4. **HTTPS**
   - Enable HTTPS in production
   - Use SSL certificates

---

## Testing API Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the endpoints from above
2. Set environment variables for `BASE_URL` and `TOKEN`
3. Test each endpoint

---

## Production Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)

```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Environment Variables for Production

**Frontend** (.env.production):
```
VITE_API_URL=https://your-production-api.com
```

**Backend** (.env):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-very-secret-key-min-32-chars
JWT_EXPIRE=30d
```

---

## Troubleshooting

### "Cannot GET /" Error
- Make sure React Router is properly configured
- Check that all pages are imported in App.tsx

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify MongoDB credentials

### "CORS Error"
- Backend CORS is configured for localhost:3000
- Update `cors()` middleware for production domains

### "Token is not valid"
- Token may have expired (30 days default)
- User needs to login again
- Check JWT_SECRET matches between login and verification

---

## Next Steps

1. **Set up MongoDB** (local or Atlas)
2. **Install dependencies** for frontend and backend
3. **Start backend**: `npm run dev` in `/backend`
4. **Start frontend**: `npm run dev` in `/fulxer termites`
5. **Test authentication** by signing up and logging in
6. **Test admin panel** with admin account
7. **Integrate AWS services** (API Gateway, S3, etc.)
8. **Deploy to production**

---

## Support & Documentation

- **Vite**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/
- **Express**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/

---

## License

MIT License - Feel free to use this project for commercial purposes.
