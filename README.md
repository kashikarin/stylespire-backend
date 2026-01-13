# 🌟 StyleSpire – Backend  
*A modular Node.js/Express API powering authentication, user data, favorites, styleboards, and image processing for the Stylespire application.*

---

## 📌 Overview

The **Stylespire Backend** is a modular REST API built with **Node.js**, **Express**, and **MongoDB**.  
It serves as the data, authentication, and orchestration layer for the Stylespire frontend, supporting both inspiration flows and advanced canvas-based editing.

Beyond standard authentication and data persistence, the backend also coordinates image processing workflows and integrates with external microservices.

The architecture emphasizes clarity, scalability, and clean separation of concerns.

---

## ✨ Core Features

### 🔹 Authentication (JWT)
- User signup and login  
- Password hashing using **bcrypt**  
- JWT-based authentication  
- Token validation via middleware  
- Protected routes for authenticated users  

---

### 🔹 User API
- Retrieve authenticated user data  
- User identity validation via JWT middleware  

---

### 🔹 Favorites API
- Add and remove favorites  
- Fetch favorites for the authenticated user  
- Favorites stored and managed in MongoDB  

---

### 🔹 Styleboard API
- Create and save StyleBoards  
- Load previously saved StyleBoards  
- Persist StyleBoard layout and metadata  
- Associate StyleBoards with authenticated users  

---

### 🔹 Background Removal API
- Endpoint for background removal requests  
- Integrates with a Python-based **rembg** microservice  
- Returns background-free images with dominant subject selection  

---

### 🔹 Uploads API
- Handles image uploads originating from client-side canvas blobs  
- Converts image blobs into stable, persistent URLs  
- Enables reliable reuse of processed images across sessions  

This flow bridges the gap between client-side canvas rendering and backend persistence.

---

## 🧩 Middleware

### ✔ `requireAuth`
Validates JWTs and attaches the authenticated user to `req.user`.

### ✔ `attachUser`
Attaches authenticated user data to persisted entities  
(e.g. StyleBoards), ensuring ownership and consistency are enforced at the backend level.

### ✔ `uploadSingle`
Handles image uploads originating from client-side canvas blobs.

- Accepts a single image file per request  
- Stores images on disk under a dedicated uploads directory  
- Generates unique, collision-safe filenames  
- Enforces file size limits and image-only uploads  

This middleware enables the conversion of transient canvas blobs into stable, persistent image resources.

### ✔ `logger.middleware`
Logs incoming requests for debugging and monitoring.

### ✔ `setupALS.middleware`
Uses **AsyncLocalStorage** to create per-request context, enabling safer logging and easier request-level debugging.

---

## 🖼 Image Upload & Processing Flow

Background removal produces binary image blobs that cannot be reliably reused directly on the client.

To address this, the backend implements a dedicated image processing pipeline:
- Images are temporarily stored in memory using **multer**
- Blob data is converted into a persistent image resource
- A stable URL is generated and returned to the frontend
- The URL is used within the StyleBoard canvas for rendering and persistence

This ensures canvas images remain stable, reusable, and consistent across sessions.

---

## 🗄 Data Layer

- **MongoDB** is used as the primary database  
- Mongoose models include:
  - Users  
  - Favorites  
  - Styleboards  

Data models are designed to support future feature expansion without major restructuring.

---

## 🛠 Tech Stack

**Backend**
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- JWT  
- bcrypt  
- Multer (in-memory file handling for image uploads)

**Integrations**
- Stylespire Frontend (React)  
- Background removal microservice (Python / rembg)

**Tooling**
- Git & GitHub  
- Postman  
- MongoDB Compass  

---

## 🔧 Environment Variables

Create a `.env` file in the backend root and include:

```
PORT=
MONGO_URI=
DB_NAME=
JWT_SECRET=
JWT_REFRESH_SECRET=
```
> ⚠️ **Do not commit actual secrets to GitHub.**  
> Make sure `.env` is included in `.gitignore`.


## ▶️ Installation & Running the Server

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```
