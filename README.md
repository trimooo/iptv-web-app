# IPTV Web Application

A modern, feature-rich IPTV web application designed for seamless channel management and enhanced user experience.

## Features

- Channel Management (Add, Edit, Delete)
- M3U Playlist Import
- Live Stream Playback
- Category Filtering
- Search Functionality
- Grid & List Views
- Database Backup System
- Responsive Design

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Express.js
- Database: PostgreSQL
- ORM: Drizzle
- Video Player: VideoJS
- State Management: TanStack Query
- UI Components: shadcn/ui
- Styling: Tailwind CSS

## Prerequisites

- Node.js (v20.x or later)
- PostgreSQL (v15 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd iptv-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Backups

The application includes an automatic backup system that:
- Creates daily backups
- Maintains the last 7 backups
- Stores backups in the `backups` directory
- Supports manual backup restoration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Update database schema

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
