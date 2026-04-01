# StudyBuddy AI

An AI-powered education app where students can **chat with an AI tutor**, **generate quizzes on any topic**, and **track learning progress** across subjects like Math, Science, English, and Coding.

## Tech stack

- **Frontend**: Next.js (Pages Router), React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, JWT auth
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini (via `@google/generative-ai`)

## Key features

- **Authentication**
  - Sign up / login (email + password)
  - **Sign in with Google** (optional; requires Google OAuth client IDs)
  - JWT-based protected routes (token stored in browser localStorage)
- **AI Chat Tutor**
  - Ask questions and get AI answers
  - Chat sessions saved to MongoDB (history + resume past sessions)
- **AI Quiz Generator**
  - Generate a 5-question multiple-choice quiz for any topic
  - Submit quiz score and store results
  - Quiz history and quiz detail view
- **Progress + Dashboard**
  - Dashboard summary: quizzes taken, average score, chat sessions
  - Subject-wise progress chart
- **Subjects**
  - Browse subjects stored in MongoDB
  - Optional DB seed script to load initial subjects

## Repo structure

```text
.
├─ backend/         # Express API + MongoDB models
├─ frontend/        # Next.js UI
├─ package.json     # Root scripts (run frontend+backend together)
└─ .gitignore
```

## Web flow diagram (user journey)

```mermaid
flowchart TD
  A[Landing Page] --> B[Sign Up]
  A --> C[Login]
  B --> D[Dashboard]
  C --> D[Dashboard]

  D --> E[Subjects]
  E --> F[Subject Details]
  F --> G[Chat Tutor]
  F --> H[Generate Quiz]

  D --> G[Chat Tutor]
  D --> H[Generate Quiz]
  H --> I[Take Quiz]
  I --> J[Submit Score]
  J --> K[Quiz History]

  D --> L[Profile]
```


## API routes (backend)

All API routes are served from `http://localhost:5001/api` by default.

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/google` — body: `{ "credential": "<Google ID token>" }`
- **Users**
  - `GET /users/profile` (protected)
  - `PUT /users/profile` (protected)
- **Subjects** (protected)
  - `GET /subjects`
  - `GET /subjects/:id`
- **Chat** (protected)
  - `POST /chat/ask`
  - `GET /chat/history`
  - `GET /chat/history/:id`
- **Quizzes** (protected)
  - `POST /quizzes/generate`
  - `POST /quizzes/:id/submit`
  - `GET /quizzes/history`
  - `GET /quizzes/:id`
- **Dashboard** (protected)
  - `GET /dashboard/stats`

## Getting started (local development)

### Prerequisites

- Node.js (LTS recommended)
- A MongoDB connection string (MongoDB Atlas works)
- A Google Gemini API key

### 1) Install dependencies

From the repo root:

```bash
npm run install-all
```

### 2) Configure environment variables

#### Backend (`backend/.env`)

Create `backend/.env` (do **not** commit it). Example:

```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key

# Optional: Sign in with Google (same Client ID as the frontend web client)
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

#### Frontend (`frontend/.env.local`)

Copy the template and fill in values:

```bash
cp frontend/.env frontend/.env.local
```

Variables (see `frontend/.env` for comments):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Optional: Sign in with Google (Web application client ID from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** of type **Web application**. Under **Authorized JavaScript origins**, add `http://localhost:3000` and your deployed frontend URL (e.g. `https://your-app.vercel.app`). Use the same client ID string in both `GOOGLE_CLIENT_ID` (backend) and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend).


### 3) Run the app

From the repo root:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`


