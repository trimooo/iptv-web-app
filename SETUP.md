# IPTV Web Application Setup Guide

## System Requirements

1. Node.js (v20.x or later)
2. PostgreSQL (v15 or later)
3. Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/trimooo/iptv-web-app.git
cd iptv-web-app
```

2. Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## Database Setup

1. Create a PostgreSQL database
2. Update the DATABASE_URL in your `.env` file with your database credentials
3. Run database migrations:
```bash
npm run db:push
```

## Running the Application

1. Development mode:
```bash
npm run dev
```
The application will be available at http://localhost:5000

2. Production build:
```bash
npm run build
npm start
```

## Project Dependencies

The application uses the following major dependencies (all included in package.json):

### Frontend
- React 18
- TanStack Query (React Query) v5
- Wouter for routing
- VideoJS for video playback
- Shadcn UI components
- Tailwind CSS for styling
- Zod for validation
- React Hook Form

### Backend
- Express
- Drizzle ORM
- IPTV Playlist Parser
- PostgreSQL client

### Development
- TypeScript
- Vite
- ESBuild
- Drizzle Kit

## Features

1. Channel Management
   - Add/remove channels
   - Import channels from M3U playlists
   - Categorize channels

2. Video Playback
   - HLS stream support
   - Full-screen mode
   - Volume controls

3. Channel Organization
   - Category filtering
   - Search functionality
   - Grid view

## Troubleshooting

1. Database Connection Issues
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists and is accessible

2. Video Playback Issues
   - Verify stream URL is accessible
   - Check browser console for errors
   - Ensure HLS stream format is correct

3. M3U Import Issues
   - Verify M3U URL is accessible
   - Check M3U format is valid
   - Ensure all required fields are present

For any other issues, please check the console logs or create an issue in the GitHub repository.
