# 🎥 VoidMeet v2 – Backend

Backend for VoidMeet v2 — a real-time WebRTC video calling app powered by Socket.IO and JWT authentication.

This version includes **Google OAuth**, improved cleanup logic, and a cleaner auth flow.

👉 **Frontend (v2):**  [VoidMeet_V2_Frontend](https://github.com/dhirajdhande19/VoidMeet_V2_Frontend)  
👉 **Live App:**  [void-meet-v2-frontend.vercel.app](https://void-meet-v2-frontend.vercel.app)

---

## ✨ New in v2 (Backend)

- 🔐 JWT auth for username/password users  
- 🔑 Google OAuth support  
- ⚡ Updated room join/leave flow  
- 🧹 Better WebRTC/signaling cleanup  
- 📦 Separate backend repo for deployment  
- 🗃 Updated MongoDB models  

---

## 🚀 Features

- JWT-based authentication  
- Google OAuth login  
- Socket.IO room management  
- WebRTC signaling events  
- Meeting history in MongoDB  
- Secure cookies + CORS setup  
- REST APIs for auth & history  

---

## 🛠 Tech Stack

- Node.js  
- Express.js  
- Socket.IO  
- MongoDB (Atlas)  
- JWT  
- bcrypt  
- Google OAuth  

---

## 📁 Folder Structure

```md
src/
├── config/
├── controllers/
├── middleware
├── models/
├── routes/
└── app.js
````

---

## 🔧 Environment Variables

Create `.env` (or use `.env.example`):

```env
PORT=8080
ATLAS_URL=
JWT_EXPIRES_IN=
JWT_SECRET=

# Frontend url
FRONTEND_URL="http://localhost:5173"

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:8080
```

---

## 🙋‍♂️ Author

Built by **Dhiraj Dhande**  
GitHub: [dhirajdhande19](https://github.com/dhirajdhande19)

