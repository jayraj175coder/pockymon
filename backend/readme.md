# Backend - PokéDex API

Express.js backend with MongoDB for Pokémon data storage and search.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/pokemon
PORT=3000
NODE_ENV=development
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
npm start
# or
npm run dev  # with nodemon for auto-reload
```

## API Endpoints

- `GET /` - API information
- `GET /api/pokemon/search` - Search Pokémon with filters

See main README.md for detailed API documentation.

