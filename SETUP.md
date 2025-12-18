# 🚀 Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ MongoDB installed and running, OR Docker Desktop installed

## Step-by-Step Setup

### Option A: Local Development (Without Docker)

#### 1. Install Backend Dependencies
```powershell
cd backend
npm install
```

#### 2. Setup Backend Environment
Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/pokemon
PORT=3000
NODE_ENV=development
```

#### 3. Start MongoDB
If MongoDB is installed locally:
```powershell
# Windows (if MongoDB is in PATH)
mongod

# Or start MongoDB service
net start MongoDB
```

#### 4. Seed the Database
```powershell
cd backend
npm run seed
```
This will fetch ALL Pokémon from PokeAPI (may take 2-3 minutes).

#### 5. Start Backend Server
```powershell
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Backend will run on `http://localhost:3000`

#### 6. Install Frontend Dependencies
Open a new terminal:
```powershell
cd frontend
npm install
```

#### 7. Start Frontend
```powershell
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Option B: Docker (Recommended - Easiest)

#### 1. Start All Services
```powershell
docker-compose up --build
```

#### 2. Seed the Database
Open a new terminal:
```powershell
docker-compose exec backend npm run seed
```

#### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Verify Installation

1. Check backend is running:
   ```powershell
   curl http://localhost:3000
   # Should return: {"message":"🚀 Pokédex API Running",...}
   ```

2. Test search endpoint:
   ```powershell
   curl "http://localhost:3000/api/pokemon/search?query=pikachu"
   ```

3. Open frontend in browser:
   - Navigate to http://localhost:5173
   - Try searching for "pikachu" or "charizard"

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check MONGO_URI in `.env` file
- For Docker: MongoDB starts automatically with `docker-compose up`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use next available port

### Seed Script Fails
- Check internet connection (needs to fetch from PokeAPI)
- Ensure MongoDB is running
- Check `.env` file has correct MONGO_URI

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3000
- Check CORS is enabled (already configured)
- Verify `VITE_API_URL` in frontend if using custom URL

## Next Steps

Once everything is running:
1. ✅ Test the search functionality
2. ✅ Try different search modes (fulltext, semantic, hybrid)
3. ✅ Filter by type and stats
4. ✅ Explore the API endpoints

Happy coding! 🎮

