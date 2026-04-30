# FulxerPro - Troubleshooting Guide

## Common Issues & Solutions

---

## Frontend Issues

### 1. "Cannot GET /" - Page Not Found

**Problem**: Landing page shows 404 error

**Solutions**:
- [ ] Check React Router is properly imported in `App.tsx`
- [ ] Verify all route components are imported
- [ ] Clear browser cache: `Ctrl+Shift+Delete`
- [ ] Restart dev server: Stop and run `npm run dev` again

```bash
# In "fulxer termites" folder
npm run dev
```

---

### 2. "Cannot find module 'react-router-dom'"

**Problem**: React Router import error

**Solution**:
```bash
cd "fulxer termites"
npm install react-router-dom@6.20.0
```

---

### 3. "VITE_API_URL is undefined"

**Problem**: API calls failing because backend URL is not set

**Solution**:
1. Create `.env.local` in `fulxer termites/` folder
2. Add: `VITE_API_URL=http://localhost:5000`
3. Restart dev server

```bash
npm run dev
```

---

### 4. Styles Not Applying (White Page)

**Problem**: CSS not loading, page appears blank/white

**Solutions**:
- [ ] Check `index.css` is imported in `main.tsx`
- [ ] Verify Tailwind config has correct content paths
- [ ] Clear cache: `rm -rf node_modules dist && npm install`
- [ ] Check browser console for CSS loading errors

```bash
# Rebuild Tailwind CSS
npm run dev -- --force
```

---

### 5. "Cannot find module 'lucide-react'"

**Problem**: Icon library not installed

**Solution**:
```bash
npm install react-icons
```

---

### 6. Form Submission Not Working

**Problem**: Sign up/login form doesn't submit

**Check**:
- [ ] Backend is running on `http://localhost:5000`
- [ ] Network tab shows API requests
- [ ] Check browser console for JavaScript errors
- [ ] Verify form validation is passing

```javascript
// Test form data in browser console
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'password123' })
}).then(r => r.json()).then(d => console.log(d))
```

---

### 7. "Failed to fetch" Error

**Problem**: Frontend can't reach backend

**Solutions**:
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify API URL in `.env.local`: `VITE_API_URL=http://localhost:5000`
3. Check CORS is enabled in backend
4. Make sure ports don't conflict (5000 for backend, 5173 for frontend)

```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Find process using port 5000 (Mac/Linux)
lsof -i :5000
```

---

## Backend Issues

### 1. "Cannot find module 'express'"

**Problem**: Dependencies not installed

**Solution**:
```bash
cd backend
npm install
```

---

### 2. "Port 5000 already in use"

**Problem**: Another process is using port 5000

**Solutions**:

**Windows**:
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID 12345 /F

# Or change port in backend/.env
PORT=5001
```

**Mac/Linux**:
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 PID
```

---

### 3. "Cannot connect to MongoDB"

**Problem**: MongoDB connection fails

**Verify MongoDB is running**:
```bash
# Windows - Check if MongoDB service is running
tasklist | findstr mongod

# Mac/Linux - Start MongoDB
mongod
```

**Check connection string in `backend/.env`**:
```
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/fulxerpro

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fulxerpro
```

---

### 4. "ECONNREFUSED 127.0.0.1:27017"

**Problem**: MongoDB not running

**Solutions**:
- [ ] Start MongoDB: `mongod`
- [ ] Check if using MongoDB Atlas
- [ ] Verify IP whitelist on Atlas
- [ ] Check credentials in connection string

---

### 5. "JWT_SECRET is undefined"

**Problem**: Environment variable not loaded

**Solution**:
1. Check `.env` file exists in backend folder
2. Add: `JWT_SECRET=your_secret_key_here`
3. Restart server: Stop and run `npm run dev`

---

### 6. 401 Unauthorized - "Token is not valid"

**Problem**: JWT token verification failing

**Causes & Solutions**:
- [ ] Token expired (30 days) → User needs to login again
- [ ] JWT_SECRET changed → Must use same secret
- [ ] Invalid token format → Check Authorization header

**Test token**:
```bash
# Get token from login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Use token to get user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. "No token provided"

**Problem**: Request missing Authorization header

**Fix in frontend**:
```javascript
// Correct way to add token
const token = localStorage.getItem('token');
axios.get('/api/auth/me', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

### 8. "User already exists"

**Problem**: Email already registered

**Solutions**:
- [ ] Use different email for testing
- [ ] Delete user from MongoDB
- [ ] Check for typos in email

---

## Database Issues

### 1. "Cannot connect to MongoDB Atlas"

**Problems & Solutions**:

**IP Whitelist**:
1. Go to MongoDB Atlas → Network Access
2. Add your IP address (or 0.0.0.0 for development)
3. Wait 1-2 minutes for changes to apply

**Wrong Credentials**:
1. Check username and password in connection string
2. Special characters must be URL-encoded
3. Test connection string in MongoDB Compass

**Wrong Cluster**:
1. Verify cluster name in connection string
2. Check database name is correct

---

### 2. "Cannot create index"

**Problem**: MongoDB collection conflict

**Solution**:
```bash
# Delete and recreate database
# In MongoDB shell
use fulxerpro
db.dropDatabase()
```

---

### 3. "Authentication failed"

**Problem**: Invalid MongoDB credentials

**Check**:
- [ ] Username and password are correct
- [ ] Special characters are URL-encoded: @ = %40, : = %3A, / = %2F
- [ ] User has access to the database

**Example**:
```
WRONG: mongodb+srv://user:pass@word@cluster.mongodb.net/
WRONG: mongodb+srv://user:password@cluster.mongodb.net:27017/

CORRECT: mongodb+srv://user:pass%40word@cluster.mongodb.net/fulxerpro
```

---

## CORS Issues

### "Access to XMLHttpRequest blocked by CORS"

**Problem**: Frontend and backend on different domains

**Check**:
- [ ] Backend has CORS enabled: `app.use(cors())`
- [ ] Frontend is making requests to correct domain
- [ ] API URL in `.env.local` is correct

**Solution in backend**:
```javascript
// Enable CORS for specific domain (production)
app.use(cors({
  origin: 'https://fulxerpro.com',
  credentials: true
}));

// Or allow all origins (development)
app.use(cors());
```

---

## Network Issues

### 1. Can't connect to API from mobile/other device

**Problem**: Using localhost URL

**Solution**:
1. Find your machine IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Use IP instead of localhost: `http://192.168.x.x:5000`
3. Both devices must be on same network

---

### 2. API works locally but not in production

**Problem**: Wrong API URL in production

**Check**:
- [ ] `.env.production` has correct API URL
- [ ] API server is deployed and running
- [ ] Domain name is correct
- [ ] SSL/HTTPS is enabled if needed

---

## Performance Issues

### 1. Page loads very slowly

**Check**:
- [ ] MongoDB connection is slow
- [ ] Network tab in DevTools to see bottlenecks
- [ ] Check API response times
- [ ] Add loading states for better UX

---

### 2. "RangeError: Maximum call stack size exceeded"

**Problem**: Infinite loop in code

**Common causes**:
- [ ] Circular imports
- [ ] useEffect without dependency array
- [ ] Infinite recursion

**Check**:
- [ ] useEffect dependencies are correct
- [ ] No circular component imports
- [ ] Components don't re-render infinitely

---

## Testing

### Test API with cURL

```bash
# Test health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@test.com", "password": "password123"}'

# Get user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

### Test with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection
3. Add requests:
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/me
4. Set Authorization header for protected routes
5. Test each endpoint

---

## Debug Mode

### Enable Verbose Logging

**Backend** - Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend** - Add to axios calls:
```javascript
axios.interceptors.request.use(req => {
  console.log('Request:', req);
  return req;
});
```

---

## Getting Help

1. **Check browser console** - Press F12 → Console tab
2. **Check terminal output** - Look for error messages
3. **Check MongoDB connection** - Verify in `.env`
4. **Search error message** - Google the exact error
5. **Check documentation** - See `SETUP_AND_INTEGRATION_GUIDE.md`

---

## Still Having Issues?

1. Clear all caches:
   ```bash
   # Frontend
   rm -rf node_modules .next dist
   npm install

   # Backend
   rm -rf node_modules
   npm install
   ```

2. Reset database:
   ```bash
   # Drop MongoDB database
   db.dropDatabase()
   ```

3. Restart everything:
   - Close all terminals
   - Kill all node processes
   - Start fresh

---

**If issue persists, check that:**
- [ ] All dependencies are installed
- [ ] MongoDB is running
- [ ] Environment variables are set
- [ ] Ports 5000 and 5173 are available
- [ ] Backend and frontend are started in correct folders
- [ ] Node.js version is v14 or higher

Good luck! 🚀
