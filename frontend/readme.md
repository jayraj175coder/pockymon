# Frontend - PokéDex Search UI

React application with Vite for the PokéDex search interface.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

The app will be available at `http://localhost:5173`

Make sure the backend API is reachable.

## Configuring the backend API URL

The frontend calls the search endpoint exposed by the backend.

- **Deployed backend (Render)**: set `VITE_API_URL` to your deployed base URL, e.g.:

```env
# frontend/.env
VITE_API_URL=https://pockymon.onrender.com
```

- **Local backend**: you can omit `VITE_API_URL` and it will default to `http://localhost:3000`.

Internally, the app calls:

```text
{VITE_API_URL || "http://localhost:3000"}/api/pokemon/search
```

The deployed backend you shared (`https://pockymon.onrender.com/`) exposes this search endpoint as documented there.

