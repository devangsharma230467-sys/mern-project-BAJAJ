# DeskFlow — Helpdesk Ticket Management

A full-stack MERN application for managing support tickets with a Kanban-style dashboard, SLA tracking, and drag-and-drop functionality.

## Tech Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, @dnd-kit, Axios
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Deployment:** Netlify (frontend) + Render (backend)

## Features

- Kanban board with 4 columns (Open → In Progress → Resolved → Closed)
- Drag-and-drop with validation (invalid drops show error toast)
- Strict status transition rules (state machine)
- SLA tracking with breach indicators
- Priority-based filtering
- Dark/Light theme toggle
- Glassmorphism UI design
- Optimistic UI updates
- Inline form validation
- Real-time stats dashboard

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # SLA & transition helpers
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Theme context
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   └── utils/           # Formatters & transitions
│   ├── netlify.toml
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| POST   | /api/tickets     | Create a ticket      |
| GET    | /api/tickets     | List tickets (with filters) |
| PATCH  | /api/tickets/:id | Update a ticket      |
| DELETE | /api/tickets/:id | Delete a ticket      |
| GET    | /api/tickets/stats | Get dashboard stats |
| GET    | /api/health      | Health check         |

### Query Parameters

- `status` — Filter by status (open, in_progress, resolved, closed)
- `priority` — Filter by priority (low, medium, high, urgent)
- `breached=true` — Show only SLA-breached tickets

### Status Transitions

```
open → in_progress → resolved → closed
         ↑                ↓
         └── (backward) ──┘
```

- Only one step backward allowed
- `resolvedAt` is cleared when moving backward from resolved

### SLA Thresholds

| Priority | Time Limit |
|----------|-----------|
| Urgent   | 1 hour    |
| High     | 4 hours   |
| Medium   | 24 hours  |
| Low      | 72 hours  |

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/devangsharma230467-sys/mern-project-BAJAJ.git
cd mern-project-BAJAJ
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if backend runs on a different port
npm run dev
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/deskflow
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user and whitelist `0.0.0.0/0` for IP access
3. Get the connection string for your `.env`

### Backend → Render

1. Create a new **Web Service** at [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add environment variables:
   - `MONGO_URI` — your Atlas connection string
   - `CLIENT_URL` — your Netlify URL (e.g., `https://deskflow-app.netlify.app`)
   - `NODE_ENV` — `production`

### Frontend → Netlify

1. Create a new site at [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Set **Base directory** to `frontend`
4. Set **Build command** to `npm install && npm run build`
5. Set **Publish directory** to `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL` — your Render URL (e.g., `https://deskflow-api.onrender.com/api`)

## API Testing Examples

```bash
# Create a ticket
curl -X POST https://your-api.onrender.com/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Login broken","description":"Users cannot log in since the last deploy","customerEmail":"user@test.com","priority":"urgent"}'

# Get all tickets
curl https://your-api.onrender.com/api/tickets

# Filter by priority
curl https://your-api.onrender.com/api/tickets?priority=urgent

# Filter breached tickets
curl https://your-api.onrender.com/api/tickets?breached=true

# Move ticket to in_progress
curl -X PATCH https://your-api.onrender.com/api/tickets/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

# Get stats
curl https://your-api.onrender.com/api/tickets/stats

# Delete a ticket
curl -X DELETE https://your-api.onrender.com/api/tickets/<id>
```

## License

MIT
