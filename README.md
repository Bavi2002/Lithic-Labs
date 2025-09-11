# Car Rental Web App

A full-stack **Car Rental Web Application** built with:

* **Frontend**: React / Next.js, deployed on **AWS Amplify**
* **Backend**: Node.js + Express, deployed as **AWS Lambda** (via API Gateway)
* **Database**: Firebase Firestore
* **Authentication**: Firebase Auth

---

## 📂 Project Structure

```
car-rental-web-app/
├── backend/
│   ├── config/
│   │   └── firebase.js
│   ├── routes/
│   │   ├── cars.js
│   │   └── bookings.js
│   ├── index.js          # Express app (runs in Lambda)
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── pages/ or app/    # Next.js pages
│   ├── components/
│   ├── package.json
│   └── .env.local
```

---

## 🚀 Deployment

### 1. Frontend (AWS Amplify)

```sh
# Inside frontend folder
cd frontend  

# Initialize Amplify project
amplify init  

# Deploy frontend
amplify add hosting  
amplify publish  
```

🔗 Your frontend will be live at a URL like:

```
https://<your-app-id>.amplifyapp.com
```

---

### 2. Backend (AWS Lambda via Amplify)

```sh
# Inside backend folder
cd backend  

# Initialize Amplify
amplify init  

# Add backend API (Lambda + API Gateway)
amplify add api  
# Choose REST API → New Lambda function → point to backend/index.js  

# Deploy
amplify push  
```

🔗 Your backend will be live at:

```
https://<api-id>.execute-api.<region>.amazonaws.com/dev/
```

---

## ⚡ Example Backend API Endpoint

`GET /cars` → List available cars
`POST /bookings` → Create a booking
`GET /bookings/:id` → Fetch a booking

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com/dev
```

---

## 🛠️ Development (Local)

### Run Backend locally

```sh
cd backend
npm install
npm start
```

### Run Frontend locally

```sh
cd frontend
npm install
npm run dev
```

App will run at → `http://localhost:3000`

---

## 📜 License

MIT License © 2025

---

Would you like me to also **add API usage examples (with curl / axios)** in the README so others can test your Lambda endpoints directly?
