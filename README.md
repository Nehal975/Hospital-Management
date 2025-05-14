# 🏥 Hospital Management System — MERN Stack

> A modern full-stack **Hospital Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This project streamlines patient care, staff coordination, and hospital administration through a secure, responsive, and intuitive web application.

---

## 🌐 Live Demo

**Coming soon...**
(Deploy on platforms like Render, Vercel, or Netlify)

---

## ✨ Features

* 👤 **User Roles** – Admins, Doctors, and Patients
* 🗕️ **Appointments** – Book, update, and cancel appointments
* 🪺 **Doctor Management** – Add/edit doctors and their specialties
* 📂 **Patient Records** – Manage personal and medical details
* 🔐 **Authentication** – JWT-based login with role-based access
* 📊 **Dashboard** – Responsive, user-friendly interface for all users

---

## 🛠 Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Frontend  | React.js, Axios, Bootstrap |
| Backend   | Node.js, Express.js        |
| Database  | MongoDB, Mongoose          |
| Security  | JWT, bcrypt, dotenv        |
| Utilities | React Router, CORS, ESLint |

---

## 🗂 Project Structure

```
Hospital-Management/
│
├── client/                    # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── assets/            # Images and icons
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level pages (Login, Dashboard, etc.)
│       ├── services/          # API service handlers (Axios)
│       ├── App.js             # Main application logic
│       └── index.js           # React entry point
│
├── server/                    # Node.js backend
│   ├── config/                # MongoDB connection config
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth, error handling middleware
│   ├── models/                # MongoDB schemas (User, Doctor, Patient, Appointment)
│   ├── routes/                # API endpoints
│   ├── .env                   # Environment variables (not included in repo)
│   └── server.js              # Entry point for backend server
│
├── README.md                  # Project documentation
└── LICENSE                    # Project license (MIT)
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

* Node.js (v14+ recommended)
* MongoDB (Local or Atlas)
* npm (Node package manager)
* Git

---

### ⚙️ Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Nehal975/Hospital-Management.git
cd Hospital-Management
```

#### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server` with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
```

#### 3. Setup Frontend

```bash
cd ../client
npm install
npm start
```

The React app will be available at `http://localhost:3000` and connects to the backend at `http://localhost:5000`.

---

## 🧐 Learning Outcomes

* Applied full-stack architecture with MERN
* Implemented authentication using JWT
* Designed modular and scalable REST APIs
* Built responsive, role-based dashboards with React
* Gained hands-on experience with secure CRUD operations

---

## 👨‍💻 Author

**Nehal Singh**
🎓 B.Tech | NIET | Full Stack Developer
📨 [nehal975@gmail.com](mailto:nehal975@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/nehal-singh-4182b0265)
📁 [GitHub](https://github.com/Nehal975)

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

> ⭐ If you like this project, feel free to star the repository and share your feedback. Contributions and suggestions are welcome!
