# IPTV Web Application Setup Guide

## System Requirements

### Core Requirements
1. Node.js v20.x or later
2. PostgreSQL v15 or later
3. npm or yarn package manager
4. Git

### System Dependencies
These will be installed automatically when running on Replit. For local development:
1. `ws` - For WebSocket support
2. `ffmpeg` - For video processing (optional)
3. Build tools (gcc, make, etc.)

## Installation Steps

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd iptv-web-app

# Install dependencies
npm install
```

### 2. Database Setup

#### Using PostgreSQL
1. Install PostgreSQL 15 or later
2. Create a new database:
```sql
CREATE DATABASE iptv_db;
```
3. Configure environment variables (see below)
4. Run database migrations:
```bash
npm run db:push
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Required
DATABASE_URL=postgresql://username:password@host:port/database

# Optional - Defaults will be used if not set
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

#### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5000`

#### Production Mode
```bash
npm run build
npm start
```

## Key Features and Dependencies

### Frontend Dependencies
- React 18 with TypeScript
- TanStack Query v5 for data fetching
- VideoJS for video playback
- Shadcn UI components
- Tailwind CSS for styling
- Wouter for routing

### Backend Dependencies
- Express.js
- Drizzle ORM
- PostgreSQL client
- IPTV Playlist Parser

### Development Tools
- TypeScript
- Vite
- ESBuild
- Drizzle Kit


## Troubleshooting

### Database Issues
1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check connection string:
- Ensure DATABASE_URL format is correct
- Test connection using psql

3. Migration Issues:
```bash
# Reset migrations
rm -rf migrations/*
npm run db:push
```

### Video Playback Issues
1. Verify stream URL is accessible
2. Check browser console for errors
3. Ensure HLS stream format is correct

### M3U Import Issues
1. Verify M3U URL is accessible
2. Check M3U format is valid
3. Ensure required fields are present

## Backup System

The application includes an automatic backup system that:
- Creates daily backups
- Maintains the last 7 backups
- Stores backups in the `backups` directory

To manually create a backup:
```bash
# Start the application - backups are handled automatically
npm run dev
```

## Support

For issues and feature requests, please:
1. Check the GitHub issues
2. Create a new issue if needed
3. Provide relevant logs and error messages