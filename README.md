# HomelyHub

**A MERN property-booking platform for discovering stays, publishing listings, and managing reservations.**

HomelyHub is an internship project built with React, Express, and MongoDB. Guests can search for properties and reserve available dates. Hosts can publish a stay and view their listings. Optional Groq-powered tools can draft listing descriptions and build trip itineraries.

**Repository:** [Shlokverma0/HomelyHub](https://github.com/Shlokverma0/HomelyHub)

**API route overview:** [Endpoints and access levels](#api-overview)

> Reservations in this project are demonstrations. The app does not collect or process payments.

## Features

- Sign up, log in, and manage an account with JWT authentication and HTTP-only cookies
- Browse property listings with city, price, property-type, room-type, amenity, guest, and date filters
- View property photos, details, amenities, and check-in information
- Publish a property listing and view your own listings
- Reserve a property for a date range; the API checks availability and calculates the total from the stored nightly rate
- View reservation history and reservation details
- Optional AI-generated property descriptions and trip plans through Groq
- Optional profile photo uploads through ImageKit
- Optional password-reset email through SMTP

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| Optional services | Groq, ImageKit, Nodemailer |

## Run Locally

### Requirements

- Node.js 20 or newer and npm
- MongoDB locally or a MongoDB Atlas connection string
- Groq, ImageKit, and SMTP credentials only if you want to use those optional features

### 1. Configure the backend

From the repository root:

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and set at least `MONGO_URI` and a long random `JWT_SECRET`. The other integrations are optional. AI tools return a clear configuration message until `GROQ_API_KEY` is set.

### 2. Start the API

In the repository root:

```powershell
npm run dev
```

The API listens on `http://localhost:8080`. The frontend Vite server proxies `/api` requests to it.

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, create an account, and publish a listing before trying a reservation. For uploaded photos, use small image files (up to 500 KB each) or add public `http`/`https` image URLs.

## API Overview

Base route: `/api/v1/rent`

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/health` | Service health check | Public |
| `POST` | `/user/signup` | Create an account | Public |
| `POST` | `/user/login` | Sign in | Public |
| `GET` | `/user/logout` | Sign out | Public |
| `GET` | `/user/me` | Get the signed-in account | Signed in |
| `GET` | `/user/myAccommodation` | List your property listings | Signed in |
| `POST` | `/listing` | Publish a property | Signed in |
| `GET` | `/listing` | Search and filter listings | Public |
| `GET` | `/listing/:id` | Get one listing | Public |
| `POST` | `/user/booking` | Create a demo reservation | Signed in |
| `GET` | `/user/booking` | List your reservations | Signed in |
| `GET` | `/user/booking/:bookingId` | Get one of your reservations | Signed in |
| `POST` | `/user/generateDescription` | Draft a listing description | Signed in, Groq configured |
| `POST` | `/trip` | Generate a trip plan and matching stays | Groq configured |

Listing search accepts `city`, `minPrice`, `maxPrice`, `propertyType`, `roomType`, `amenities`, `guests`, `dateIn`, `dateOut`, `page`, and `limit` query parameters.

## Environment Variables

See [`.env.example`](.env.example) for the complete list. Keep your real `.env` file and service keys private; `.env` is ignored by Git.

## Deploy on Render

The repository includes [`render.yaml`](render.yaml) for a single Render web service. It builds the Vite frontend and serves it from the Express app, so the website and API share one origin. This keeps the existing relative `/api` requests and cookie-based sign-in on the same host.

1. Push the repository to GitHub and choose **New → Blueprint** in the Render dashboard.
2. Connect `Shlokverma0/HomelyHub` and let Render read `render.yaml` from the `main` branch.
3. Set `MONGO_URI` to a MongoDB Atlas connection string. Add the service's outbound IP ranges from Render's **Connect → Outbound** panel to the Atlas project's IP access list.
4. Deploy. Render supplies the service URL to the app automatically. Check `https://<your-service>.onrender.com/health` for the health response and open the service root for the app.

The blueprint generates `JWT_SECRET` for the service. Optional integrations such as Groq, ImageKit, and SMTP can be added later using the variable names in `.env.example`. Never commit production secrets. Render Free web services can spin down when idle, so the first request after inactivity may be slow.

## Project Structure

```text
HomelyHub/
├── frontend/              # React application
│   ├── public/assets/     # Local branding and sample photos
│   └── src/
├── src/                   # Express API
│   ├── controllers/
│   ├── Models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env.example
├── render.yaml            # Render web service configuration
└── package.json
```

## Author

**Shlok Verma** · [GitHub](https://github.com/Shlokverma0)

Built as the **HomelyHub – Property Booking Platform** project during the Emertxe Full Stack internship.
