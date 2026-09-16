# 🏠 HomelyHub

> **A full-stack real-estate marketplace built with the MERN stack for discovering, listing, and managing properties for rent or sale.**

HomelyHub is a **full-stack real-estate marketplace** that allows users to create accounts, browse property listings, search and filter properties, upload property images, and manage their own listings.

The application follows a **client-server architecture**, with a React-based frontend communicating with a RESTful Express.js backend backed by MongoDB.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password hashing with `bcryptjs`
* Protected property management routes
* Token-based authorization
* User-specific property management

### 🏘️ Property Management

* Create property listings
* Browse available properties
* View detailed property information
* Update existing listings
* Delete property listings
* Support for properties available for **rent or sale**

### 🔎 Search & Filtering

* Search properties by location
* Filter properties by price
* Filter by property type
* API-based querying and filtering
* Dynamic property listing results

### 🖼️ Image Management

* Upload property images
* Image hosting and delivery through **ImageKit**
* Display property images throughout the application

### 📧 Email Integration

* Email functionality using **Nodemailer**
* Backend-based email communication

### 📱 Responsive Frontend

* Responsive React UI
* Client-side routing with React Router
* REST API integration using Axios
* Reusable React components

---

## 🛠️ Tech Stack

### Frontend

| Technology             | Purpose             |
| ---------------------- | ------------------- |
| **React.js**           | Frontend UI         |
| **React Router**       | Client-side routing |
| **Axios**              | API communication   |
| **Tailwind CSS / CSS** | Styling             |

### Backend

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| **Node.js**    | Backend runtime            |
| **Express.js** | REST API framework         |
| **MongoDB**    | Database                   |
| **Mongoose**   | MongoDB ODM                |
| **JWT**        | Authentication             |
| **bcryptjs**   | Password hashing           |
| **Nodemailer** | Email communication        |
| **ImageKit**   | Image storage and delivery |

---

## 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │      React.js        │
                         │    Frontend UI       │
                         │                      │
                         │ React Router + Axios │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST API
                                    ▼
                         ┌──────────────────────┐
                         │     Express.js       │
                         │      Backend         │
                         │                      │
                         │ Routes / Controllers │
                         │ Authentication       │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   MongoDB    │  │   ImageKit   │  │  Nodemailer  │
          │              │  │              │  │              │
          │ Users        │  │ Property     │  │ Email        │
          │ Properties   │  │ Images       │  │ Services     │
          └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 📂 Project Structure

```text
HomelyHub/
│
├── backend/
│   ├── src/
│   │   ├── Models/
│   │   │   ├── userModel.js
│   │   │   └── propertyModel.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authControllers.js
│   │   │   └── propertyController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   └── propertyRouter.js
│   │   │
│   │   ├── utils/
│   │   │   ├── db.js
│   │   │   ├── token.js
│   │   │   ├── mail.js
│   │   │   ├── APIFeatures.js
│   │   │   └── ImagekitIO.js
│   │   │
│   │   └── index.js
│   │
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **MongoDB** or a MongoDB Atlas database
* **ImageKit** account
* An email service/account for Nodemailer

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Arpit-tyagi001/HomelyHub.git
cd HomelyHub
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=8080

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

> ⚠️ **Never commit your `.env` file or expose your API keys, database credentials, JWT secret, or email credentials.**

### 4. Start the backend

```bash
npm run dev
```

The backend will start on the configured port.

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend will be available through the Vite development server.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| `POST` | `/api/v1/rent/user/register` | Register a new user                |
| `POST` | `/api/v1/rent/user/login`    | Authenticate user and generate JWT |

### Properties

| Method   | Endpoint                   | Description                  |
| -------- | -------------------------- | ---------------------------- |
| `GET`    | `/api/v1/rent/listing`     | Retrieve property listings   |
| `POST`   | `/api/v1/rent/listing`     | Create a property listing    |
| `GET`    | `/api/v1/rent/listing/:id` | Retrieve a specific property |
| `PATCH`  | `/api/v1/rent/listing/:id` | Update a property listing    |
| `DELETE` | `/api/v1/rent/listing/:id` | Delete a property listing    |

> **Note:** Endpoint paths should be verified against the current backend route configuration before publishing this section.

---

## 🔑 Authentication Flow

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
                  Register / Login
                        │
                        ▼
                ┌───────────────┐
                │  Express API  │
                └───────┬───────┘
                        │
              ┌─────────┴─────────┐
              │                   │
        Validate User       Verify Password
              │                   │
              └─────────┬─────────┘
                        │
                    Generate JWT
                        │
                        ▼
                ┌───────────────┐
                │    Client     │
                └───────┬───────┘
                        │
                    JWT Token
                        │
                        ▼
              Protected API Routes
                        │
                        ▼
                   MongoDB
```

---

## 🧠 Technical Highlights

### RESTful Backend

Designed and implemented a REST API using **Node.js and Express.js** for user authentication and property management.

### JWT Authentication

Implemented token-based authentication to protect private property management operations.

### Secure Password Handling

Used `bcryptjs` to hash user passwords before storing them in the database.

### MongoDB Data Layer

Used **MongoDB with Mongoose** for persistent storage of user and property information.

### Image Uploads

Integrated **ImageKit** to handle property image storage and delivery.

### API Filtering

Implemented reusable API filtering and querying functionality through `APIFeatures.js`.

### Email Integration

Integrated **Nodemailer** for backend email communication.

### React Frontend

Built the client interface using React with reusable components and React Router for navigation.

### Frontend–Backend Integration

Connected the React frontend to the Express REST API using **Axios**.

---

## 🔄 Application Flow

```text
User
 │
 ├── Register / Login
 │
 ▼
JWT Authentication
 │
 ▼
Browse Properties
 │
 ├── Search
 ├── Filter
 └── View Details
 │
 ▼
Authenticated User
 │
 ├── Create Listing
 ├── Update Listing
 └── Delete Listing
 │
 ▼
Express REST API
 │
 ├── MongoDB
 ├── ImageKit
 └── Nodemailer
```

---

## 🔮 Future Enhancements

The following features are planned for future versions:

* 💳 Property booking and payment integration
* 🛡️ Admin dashboard
* ⭐ Property reviews and ratings
* 🗺️ Map-based property discovery
* ❤️ Wishlist and saved properties
* 🔔 Real-time notifications
* 💬 Buyer–seller messaging
* 📊 Property-owner analytics dashboard
* ☁️ Production deployment
* 🔄 Automated CI/CD pipeline

---

## 👨‍💻 Author

### Arpit Tyagi

**Computer Science Engineering Student | Full-Stack Developer**

I build full-stack web applications with a focus on **React, Node.js, Express, MongoDB, Python, and AI-powered applications**.

### Connect

* **GitHub:** [Arpit-tyagi001](https://github.com/Arpit-tyagi001)

---

## 📄 License

This project is licensed under the **MIT License**.
