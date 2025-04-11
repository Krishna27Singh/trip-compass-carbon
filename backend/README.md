
# Trip Compass Backend

This is the backend server for the Trip Compass Carbon application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root of the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trip-compass
WEATHER_API_KEY=your_weather_api_key
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
```

### Seeding the Database

To populate the database with initial data:
```
node seed/seed.js
```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Destinations

- `GET /api/destinations/popular` - Get popular destinations
- `GET /api/destinations/search?query=...` - Search destinations
- `POST /api/destinations` - Add a new destination
- `POST /api/destinations/bulk` - Add multiple destinations

### Activities

- `GET /api/activities?destination=...` - Get activities for a destination
- `POST /api/activities` - Add a new activity
- `POST /api/activities/bulk` - Add multiple activities

### Weather

- `GET /api/weather?lat=...&lng=...&date=...` - Get weather forecast for a location and date

## Project Structure

```
/backend
  /controllers    - API route handlers
  /models         - Mongoose models
  /routes         - Express routes
  /seed           - Database seed scripts
  server.js       - Main server entry point
```
