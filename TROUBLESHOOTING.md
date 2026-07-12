# TransitOps360 Troubleshooting Guide

## 🔍 Debugging Checklist

### Step 1: Check All Servers are Running

```bash
# Check Backend
curl http://localhost:8000/health

# Check Frontend accessible
# Open http://localhost:5176 in browser
```

### Step 2: Check Environment Variables

**Backend**: `backend/.env`
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops360
```

**Frontend**: `frontend/.env`
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
```

### Step 3: Check Browser DevTools (F12)

- **Console Tab**: Look for red errors
- **Network Tab**: Check API requests to `http://localhost:8000/*`
- **Application Tab**: Check localStorage for `access_token`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot GET /api/v1/vehicles" (404 Error)

**Symptoms**:
- Backend not responding to API calls
- Swagger UI shows "Failed to load"
- Network tab shows 404 errors

**Solutions**:

1. **Verify backend is running**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

2. **Check backend started correctly**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```
   Should show: `Uvicorn running on http://0.0.0.0:8000`

3. **Verify database connection**
   - Ensure PostgreSQL is running on port 5432
   - Check DATABASE_URL in backend/.env
   - Verify database exists: `psql -U postgres -l`

4. **Check routers are registered in main.py**
   - Open `backend/app/main.py`
   - Verify all routers are included with correct prefixes
   - Look for: `app.include_router(...)`

---

### Issue 2: "Access to XMLHttpRequest ... CORS Error"

**Symptoms**:
- Browser console shows CORS error
- API request blocked
- Error: "Access-Control-Allow-Origin header missing"

**Solutions**:

1. **Check CORS configuration**
   - Open `backend/app/core/config.py`
   - Verify frontend port is in `ALLOWED_ORIGINS`:
     ```python
     ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5176"]
     ```

2. **Restart backend after CORS changes**
   ```bash
   # Stop backend (Ctrl+C)
   # Then restart
   uvicorn app.main:app --reload --port 8000
   ```

3. **Check frontend URL**
   - Open http://localhost:5176
   - Look at address bar
   - Ensure it matches ALLOWED_ORIGINS

---

### Issue 3: "401 Unauthorized" on API Calls

**Symptoms**:
- Login appears successful
- API calls return 401
- Token not being sent with requests

**Solutions**:

1. **Check token in localStorage**
   - Open DevTools → Application → LocalStorage
   - Look for key: `access_token`
   - Should have a long JWT token (starts with "eyJ")

2. **Check token expiry**
   - Login tokens expire after 30 minutes
   - Solution: Logout and login again

3. **Check JWT interceptor**
   - Open `frontend/src/api/client.ts`
   - Verify request interceptor adds Authorization header:
     ```typescript
     config.headers.Authorization = `Bearer ${token}`
     ```

4. **Test with cURL**
   ```bash
   TOKEN="<your-token-from-login>"
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/vehicles
   ```

---

### Issue 4: "TypeError: Cannot read property 'data' of undefined"

**Symptoms**:
- Frontend crashes after login attempt
- Console shows undefined error
- Page not loading

**Solutions**:

1. **Check login response format**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
   Should return JSON with `access_token`

2. **Verify backend returned correct response**
   - Open `backend/app/api/v1/auth.py`
   - Check login endpoint returns Token object
   - Verify response model includes `access_token`

3. **Check frontend error handling**
   - Open `frontend/src/pages/LoginPage.tsx`
   - Verify try-catch handles errors properly
   - Look for: `response.data.access_token`

---

### Issue 5: "Database Connection Refused"

**Symptoms**:
- Backend crashes on startup
- Error: "could not connect to server"
- Log shows connection error

**Solutions**:

1. **Check PostgreSQL is running**
   - Windows: Check Services (services.msc) for PostgreSQL
   - Mac: `brew services list | grep postgres`
   - Linux: `sudo systemctl status postgresql`

2. **Start PostgreSQL if not running**
   - Windows: Services → PostgreSQL → Right-click → Start
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Verify connection string**
   - Open `backend/.env`
   - Check DATABASE_URL format:
     ```
     postgresql://postgres:postgres@localhost:5432/transitops360
     ```
   - Verify username/password are correct

4. **Create database if missing**
   ```bash
   psql -U postgres -c "CREATE DATABASE transitops360;"
   ```

5. **Check port 5432 is available**
   ```bash
   # Windows
   netstat -an | findstr 5432
   
   # Mac/Linux
   lsof -i :5432
   ```

---

### Issue 6: "TypeScript Errors in Build"

**Symptoms**:
- `npm run build` fails
- Compilation errors shown
- Build has red X marks

**Solutions**:

1. **Check TypeScript errors**
   ```bash
   cd frontend
   npm run build
   # Read error messages carefully
   ```

2. **Check service imports**
   - Open file with error
   - Verify imports match actual file names
   - Example: `import vehicleService from '@/services/vehicleService'`

3. **Check type definitions**
   - Look for: "Cannot find module"
   - Verify file exists at the path
   - Check tsconfig.json paths are correct

4. **Clear node_modules and reinstall**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

---

### Issue 7: "Port 8000 Already in Use"

**Symptoms**:
- Cannot start backend
- Error: "Address already in use"
- Port 8000 occupied

**Solutions**:

1. **Find process using port 8000**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Mac/Linux
   lsof -i :8000
   ```

2. **Kill process**
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # Mac/Linux
   kill -9 <PID>
   ```

3. **Use different port**
   ```bash
   uvicorn app.main:app --port 8001
   # Then update VITE_API_BASE_URL in frontend .env
   ```

---

### Issue 8: "Cannot Find Module" in Frontend

**Symptoms**:
- Error: "Cannot find module '@/services/...'"
- Import paths not resolving
- Red squiggly lines in IDE

**Solutions**:

1. **Verify services exist**
   ```bash
   ls frontend/src/services/
   # Should show: authService.ts, vehicleService.ts, etc.
   ```

2. **Check import paths**
   - Use `@/` prefix for absolute imports
   - Should map to `src/` folder
   - Verify `tsconfig.json` has:
     ```json
     "paths": { "@/*": ["./src/*"] }
     ```

3. **Restart IDE/Editor**
   - TypeScript language server may need restart
   - Close and reopen IDE

---

### Issue 9: "Login Succeeds but Dashboard Doesn't Load"

**Symptoms**:
- Login works, token stored
- Redirect happens
- But dashboard shows blank or error

**Solutions**:

1. **Check for JavaScript errors**
   - Open DevTools → Console
   - Look for red errors
   - Note the exact error message

2. **Check API calls**
   - Open DevTools → Network
   - Look for any failed API requests
   - Check response status and message

3. **Verify mock data is still in place**
   - DashboardPage may still use mock data (not real API)
   - This is OK during integration
   - Will work until pages are updated

4. **Check AppLayout**
   - Open `frontend/src/components/layout/AppLayout.tsx`
   - Verify it renders correctly with sidebar

---

### Issue 10: "Styles Not Working / Pages Look Wrong"

**Symptoms**:
- CSS not applied
- Colors wrong
- Layout broken

**Solutions**:

1. **Check CSS variables are set**
   - Open `frontend/src/index.css`
   - Verify `:root` has CSS variables defined
   - Check `.dark` class has dark mode variables

2. **Verify theme is applied**
   - Open DevTools
   - Check `<html>` element for `dark` class
   - Check localStorage for theme preference

3. **Check Tailwind build**
   - Verify `tailwind.config.js` exists
   - Run: `npm run build`
   - CSS should be compiled

4. **Restart dev server**
   - Stop: Ctrl+C
   - Start: `npm run dev`
   - This forces CSS rebuild

---

## 🔧 Advanced Debugging

### Test API with cURL (Step by Step)

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Save token
TOKEN="<copy-access_token-from-above>"

# 4. Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me

# 5. List vehicles
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/vehicles

# If any of these fail, backend issue
# If all succeed, frontend issue
```

### Check Backend Logs

```bash
# Look at backend server output
# Should show something like:
# INFO:     127.0.0.1:50000 - "POST /api/v1/auth/login HTTP/1.1" 200 OK
# INFO:     127.0.0.1:50001 - "GET /api/v1/vehicles HTTP/1.1" 200 OK

# If you see 500 errors, there's a backend bug
# If you see 401 errors, authentication issue
```

### Test Service Layer Directly

Open browser console and test:

```javascript
// In browser console (after login)
import vehicleService from '/src/services/vehicleService'

// This will work:
vehicleService.getAll().then(console.log).catch(console.error)

// This shows if service is working
```

---

## 📋 Debugging Workflow

1. **Identify the issue**
   - Where does it happen? (Login, Dashboard, API call, etc.)
   - What's the error message?
   - When did it start?

2. **Check backend first**
   - Is it running? `curl http://localhost:8000/health`
   - Is database connected? (Check server logs)
   - Do endpoints work? (Test with cURL)

3. **Check frontend next**
   - Are requests being sent? (DevTools Network tab)
   - What status codes? (200, 401, 404, 500?)
   - Are there JavaScript errors? (DevTools Console tab)

4. **Verify configuration**
   - .env files correct?
   - Environment variables set?
   - Ports not conflicting?

5. **Check logs**
   - Backend server output
   - Browser console (F12)
   - Terminal output

---

## 🆘 When Nothing Works

1. **Clean install backend**
   ```bash
   cd backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Clean install frontend**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Reset database**
   ```bash
   psql -U postgres -c "DROP DATABASE transitops360;"
   psql -U postgres -c "CREATE DATABASE transitops360;"
   cd backend && alembic upgrade head
   ```

4. **Restart everything**
   - Close all terminals
   - Restart PostgreSQL
   - Start backend fresh
   - Start frontend fresh

5. **Still not working?**
   - Check all services running: `curl http://localhost:8000/health`
   - Check frontend loads: Open http://localhost:5176
   - Test API directly: Use cURL examples above

---

## 📞 Getting Help

If you're stuck:

1. **Check the documentation**
   - `INTEGRATION_GUIDE.md` - Setup steps
   - `API_TESTING.md` - API examples
   - `QUICK_START.md` - Quick reference

2. **Review your logs**
   - Backend output in terminal
   - Browser DevTools (F12)
   - Error messages (read carefully!)

3. **Test with simple tools**
   - Use cURL to test API
   - Use Postman to test endpoints
   - Use browser DevTools to debug

4. **Isolate the issue**
   - Is it frontend or backend?
   - Is it configuration or code?
   - Is it missing data or logic error?

---

## ✅ Validation Steps

Once everything is working:

1. **Backend**
   ```bash
   curl http://localhost:8000/health
   # Returns: {"status":"healthy"}
   ```

2. **Frontend**
   ```
   Open: http://localhost:5176
   See: Login page loads
   ```

3. **Login**
   ```
   Email: admin@transit.com
   Password: admin123
   Result: Redirects to dashboard
   ```

4. **API**
   ```
   DevTools Network tab shows:
   POST /auth/login - 200
   GET /vehicles - 200 (or other endpoints)
   ```

5. **Data**
   ```
   Dashboard shows data
   No console errors
   All pages accessible
   ```

---

**Last Updated**: July 12, 2026
**Status**: Ready for Testing ✅
