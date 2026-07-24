# GitHub Profile Viewer

A modern web application that displays GitHub user profiles in a clean, elegant interface. Built with **NestJS** (backend) and **Next.js** (frontend).

![Preview](./preview.png)

## Technologies

### Backend
- [NestJS](https://nestjs.com/)
- TypeScript
- Axios (HttpModule)
- ConfigModule

### Frontend
- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- TailwindCSS
- Lucide React

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/github-profile-viewer.git
cd github-profile-viewer
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
GITHUB_API_URL=https://api.github.com
CORS_ORIGIN=*
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> Copy `.env.example` files and adjust values as needed.

## Running Locally

Start both servers in separate terminals:

### Backend

```bash
cd backend
npm run start:dev
```

The API will be available at `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

## API Endpoint

```
GET /user/:username
```

Returns profile information for the given GitHub username.

### Response Example

```json
{
  "name": "Nicolas Diaz",
  "login": "Nicolas29Diaz2",
  "avatar_url": "https://avatars.githubusercontent.com/u/...",
  "bio": "Full Stack Developer",
  "company": "Acme Inc",
  "blog": "https://nicolasdiaz.dev",
  "location": "Santiago, Chile",
  "twitter_username": "nicolasdiaz",
  "public_repos": 42,
  "followers": 100,
  "following": 50,
  "created_at": "2020-01-01T00:00:00Z",
  "html_url": "https://github.com/Nicolas29Diaz2"
}
```

## Project Structure

```
github-profile-viewer/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── dto/
│   │   │       └── user-profile.dto.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── lib/
│   │       └── constants.ts
│   ├── .env.example
│   ├── .env.local
│   └── package.json
└── README.md
```

## Available Scripts

### Backend

| Script           | Description                |
| ---------------- | -------------------------- |
| `npm run start`  | Start the server           |
| `npm run start:dev` | Start in watch mode     |
| `npm run build`  | Compile the project        |
| `npm run start:prod` | Start the production build |

### Frontend

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start development server      |
| `npm run build` | Create production build       |
| `npm run start` | Start production server       |

## Deployment

### Backend — Railway

1. Push the `backend/` directory (or monorepo root) to a GitHub repository.
2. Create a new project on [Railway](https://railway.app/).
3. Connect your repository.
4. Set the start command to `npm run start:prod`.
5. Add the environment variables:
   - `PORT`
   - `GITHUB_API_URL`
   - `CORS_ORIGIN`

### Frontend — Vercel

1. Push the `frontend/` directory (or monorepo root) to a GitHub repository.
2. Import the project on [Vercel](https://vercel.com/).
3. Set the root directory to `frontend` (if using monorepo).
4. Add the environment variable:
   - `NEXT_PUBLIC_API_URL` — set to your deployed Railway backend URL.

## License

MIT
