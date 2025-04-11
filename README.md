
# Trip Compass Carbon

A travel itinerary planner with carbon footprint tracking.

## Project Structure

This project consists of two main parts:

1. **Frontend** - A React application built with TypeScript, Tailwind CSS, and shadcn/ui
2. **Backend** - An Express.js API with MongoDB database

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation and Running

#### Backend

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
WEATHER_API_KEY=21a7c32090574b6ea7865606251004
AMADEUS_API_KEY=NaPzZ7boqIGqZefBmEHmiGsdFta8HHCN
AMADEUS_API_SECRET=qjCWakubmdMEJlKG
```

4. Seed the database:
```
node seed/seed.js
```

5. Start the backend server:
```
npm run dev
```

The backend API will be available at: http://localhost:5000

#### Frontend

1. Navigate to the frontend directory (from the project root):
```
cd .
```

2. Install dependencies:
```
npm install
```

3. Start the frontend development server:
```
npm run dev
```

The frontend application will be available at: http://localhost:5173

## Features

- Create and manage travel itineraries
- Track carbon footprint of activities and transportation
- View itineraries on an interactive map
- Check weather forecasts for your trip
- Discover activities for popular destinations

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Leaflet (for maps)
- Axios

### Backend
- Express.js
- MongoDB with Mongoose
- Weather API
- Amadeus API for travel activities

## Deployment

For production deployment:

1. Build the frontend:
```
npm run build
```

2. Start both the frontend and backend servers.

3. Configure your reverse proxy (like Nginx) to route API requests to the backend server and serve the frontend static files.
