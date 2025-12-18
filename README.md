# 🎮 PokéDex Search Application

A full-stack Pokémon search application with full-text and semantic search capabilities, built for an intern developer assessment.

## 📋 Features

### Task 1 - PokéDex
- ✅ Extracts **ALL** available Pokémon from the PokeAPI (not just 200)
- ✅ Extracts essential stats: `name`, `height`, `weight`, `type`, `attack`, `defense`, `HP`, `speed`
- ✅ Stores cleaned data in MongoDB with proper indexing

### Task 2 - Search Endpoint
- ✅ RESTful API endpoint for filtering and searching Pokémon
- ✅ **Full-text search** using MongoDB text indexes
- ✅ **Semantic search** using similarity scoring and fuzzy matching
- ✅ **Hybrid search mode** combining both approaches
- ✅ Advanced filtering by type, stats (attack, defense, HP, speed)
- ✅ Beautiful, modern React UI with real-time search

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Docker, Docker Compose
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

```
pokemon/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Server entry point
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── models/
│   │   │   └── Pokemon.js      # Mongoose schema
│   │   ├── controllers/
│   │   │   └── pokemon.controller.js
│   │   ├── services/
│   │   │   └── pokemon.service.js  # Search logic
│   │   ├── routes/
│   │   │   └── pokemon.routes.js
│   │   └── scripts/
│   │       └── seedPokemon.js  # Data seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   └── SearchPokemon.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (or use Docker)
- Docker & Docker Compose (optional)

### Option 1: Local Development

#### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/pokemon
PORT=3000
NODE_ENV=development
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Option 2: Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Seed the database (in a new terminal)
docker-compose exec backend npm run seed

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

## 📡 API Endpoints

### Search Pokémon
```
GET /api/pokemon/search
```

**Query Parameters:**
- `query` (string): Search term for name or type
- `type` (string): Filter by Pokémon type (e.g., "fire", "water")
- `minAttack`, `maxAttack` (number): Filter by attack stat range
- `minDefense`, `maxDefense` (number): Filter by defense stat range
- `minHp`, `maxHp` (number): Filter by HP stat range
- `minSpeed`, `maxSpeed` (number): Filter by speed stat range
- `limit` (number): Number of results (default: 20)
- `searchMode` (string): `"fulltext"`, `"semantic"`, or `"hybrid"` (default: `"hybrid"`)

**Example:**
```bash
curl "http://localhost:3000/api/pokemon/search?query=pikachu&type=electric&minAttack=50"
```

**Response:**
```json
{
  "count": 1,
  "data": [
    {
      "_id": "...",
      "name": "pikachu",
      "height": 4,
      "weight": 60,
      "types": ["electric"],
      "stats": {
        "hp": 35,
        "attack": 55,
        "defense": 40,
        "speed": 90
      },
      "searchText": "pikachu electric",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## 🔍 Search Features

### Full-Text Search
- Uses MongoDB's text index for fast keyword matching
- Searches across Pokémon names and types
- Returns results sorted by relevance score

### Semantic Search
- Implements similarity scoring algorithm
- Handles partial matches and typos
- Considers name similarity, type matching, and character overlap
- Provides intelligent ranking beyond exact matches

### Hybrid Search
- Combines full-text and semantic search results
- Automatically falls back to semantic search if text index is unavailable
- Provides the best of both worlds for optimal search experience

## 🎨 Frontend Features

- **Real-time Search**: Search as you type (press Enter to search)
- **Advanced Filtering**: Filter by type and stat ranges
- **Search Modes**: Choose between full-text, semantic, or hybrid search
- **Beautiful UI**: Modern, responsive design with Pokémon type colors
- **Stat Display**: Visual representation of all Pokémon stats
- **Type Badges**: Color-coded type indicators

## 🐳 Docker Deployment

The application is containerized and ready for deployment:

- **Backend**: Node.js 18 Alpine image
- **Frontend**: Vite dev server (can be built for production)
- **MongoDB**: Official MongoDB 7 image
- **Networking**: All services on a shared Docker network

### Production Build

For production, you may want to build the frontend:

```dockerfile
# In frontend/Dockerfile, change CMD to:
CMD ["npm", "run", "build"]
```

## 📝 Database Schema

```javascript
{
  name: String (required, unique, indexed),
  height: Number,
  weight: Number,
  types: [String] (indexed),
  stats: {
    hp: Number (indexed),
    attack: Number (indexed),
    defense: Number (indexed),
    speed: Number (indexed)
  },
  searchText: String (text indexed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Quality
- ESLint configuration recommended
- Follow ES6+ best practices
- Use async/await for async operations

## 📦 Dependencies

### Backend
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `axios`: HTTP client for PokeAPI
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables

### Frontend
- `react`: UI library
- `react-dom`: React DOM renderer
- `axios`: HTTP client
- `vite`: Build tool and dev server

## 🚢 Deployment Options

### GCP Cloud Run
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to Cloud Run

### Cloudflare Workers
- Backend API can be adapted for Cloudflare Workers
- Frontend can be deployed to Cloudflare Pages

## 📄 License

This project is created for assessment purposes.

## 👤 Author

Created for Intern - Developer position assessment.

---

**Note**: Make sure MongoDB is running before starting the backend server. The seed script will fetch all available Pokémon from the PokeAPI, which may take a few minutes.

