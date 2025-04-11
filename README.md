
# WanderWise Travel Planner

WanderWise is a comprehensive travel planning application that helps users create detailed itineraries, track activities, and monitor their budget.

## Features

- Create detailed travel itineraries with daily activities
- Budget planning and tracking in Indian Rupees (₹)
- Budget alerts when daily spending exceeds your limit
- Interactive map view of your travel locations
- Activity suggestions based on your destination
- Carbon footprint tracking for eco-conscious travelers

## Tech Stack

### Frontend:
- React
- TypeScript
- Tailwind CSS
- Leaflet for maps
- Shadcn UI components

### Backend:
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

## Running the Application

### Prerequisites
- Node.js and npm
- MongoDB (local or Atlas connection)

### Setup & Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd wanderwise
```

2. **Install frontend dependencies**

```bash
npm install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
```

4. **Start MongoDB** (if using local MongoDB)

Make sure MongoDB is running on your system.

5. **Start the backend server**

```bash
# From the backend directory
npm start
```

This will start the backend server on http://localhost:5000.

6. **Start the frontend development server**

```bash
# From the root directory
npm start
```

This will start the frontend on http://localhost:3000.

7. **Seed the database with initial data (optional)**

```bash
# From the backend directory
npm run seed
```

Or you can use the API endpoint:

```
POST /api/destinations/seed
```

## API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/search?query=<query>` - Search destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create new destination
- `POST /api/destinations/seed` - Seed initial destinations

### Activities
- `GET /api/activities/destination/:destinationId` - Get activities for a destination
- `GET /api/activities/location?lat=<lat>&lng=<lng>` - Get activities by location coordinates
- `POST /api/activities` - Create new activity

### Itineraries
- `GET /api/itineraries` - Get all itineraries
- `GET /api/itineraries/:id` - Get itinerary by ID
- `POST /api/itineraries` - Create new itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary
- `POST /api/itineraries/:itineraryId/days/:dayId/activities` - Add activity to a day
- `DELETE /api/itineraries/:itineraryId/days/:dayId/activities/:activityId` - Remove activity from a day
- `POST /api/itineraries/:id/calculate-footprint` - Calculate carbon footprint

### Weather
- `GET /api/weather/forecast?lat=<lat>&lng=<lng>&days=<days>` - Get weather forecast
