# 🌟 Stylespire – Backend  
*A secure Node.js/Express API powering authentication, user data, and favorites management for the Stylespire application.*

---

## 📌 Overview

The **Stylespire Backend** is a lightweight, modular API built with **Node.js**, **Express**, and **MongoDB**.  
It supports secure user authentication, favorites management, and user retrieval, serving as the data and authentication layer for the Stylespire Frontend.

This backend is designed with clarity, simplicity, and scalability in mind.

---

## ✨ Features

### 🔹 Authentication (JWT)
- User signup & login  
- Password hashing using **bcrypt**  
- JWT-based authentication system  
- Access token validation via middleware  
- Protected routes for authenticated users  

---

### 🔹 User API
- Retrieve authenticated user data  
- Verify user identity through JWT middleware  

---

### 🔹 Favorites API
- Add favorites  
- Remove favorites  
- Fetch favorites for the logged-in user  
- Stored and managed in MongoDB  

---

## 🧩 Middlewares

### ✔ `requireAuth`
Validates JWT and attaches the authenticated user to `req.user`.

### ✔ `logger.middleware`
Logs incoming requests for debugging and monitoring.

### ✔ `setupALS.middleware`  
(ALS = AsyncLocalStorage)  
Creates per-request context for tracing and debugging purposes.

---

## 🔧 Environment Variables

Create a `.env` file in the backend root with the following variables:

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

## 🚀 Coming Next (V2)

The backend will expand alongside the upcoming **Stylespiration Board** feature on the frontend.  
Planned backend enhancements include:

- Additional endpoints for board data (saving, loading, sharing)  
- Data models for user-created boards  
- Enhanced favorites handling to integrate with the board workflow  
- Future expansion as the application grows  
