
# Car Rental Web App

## Features
- User authentication (login/register) with Firebase Email/Password.
- Browse and search available cars with detailed views.
- Book cars with date selection and availability checks.
- Add new cars.
- View and manage user bookings.
- Responsive design for desktop and mobile devices.

## Technologies
- **Frontend**: 
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Redux Toolkit for state management
- **Backend**: 
  - Node.js
  - Express (adapted for Lambda)
  - Firebase Admin SDK
- **Database**: Firebase Firestore
- **Deployment**: AWS Amplify (frontend), AWS Lambda (backend)
- **CI/CD**: GitHub Actions

## Setup and Deployment

### Prerequisites
- Node.js 18+ (recommended)
- AWS account with Amplify and Lambda access
- Firebase project with Authentication and Firestore enabled
- Git installed for cloning the repository
- AWS CLI installed (`npm install -g aws-cli`)
- Amplify CLI installed (`npm install -g @aws-amplify/cli` and run `amplify configure`)
- Serverless Framework CLI installed (`npm install -g serverless`)

### Clone and Run Locally
1. **Clone the Repository**:
   ```
   git clone https://github.com/Bavi2002/Lithic-Labs.git
   cd car-rental-web-app
   ```

2. **Install Dependencies**:
   - Frontend:
     ```
     npm install
     ```
   - Backend:
     ```
     cd backend && npm install
     ```

3. **Configure Environment Variables**:
   - Create a `.env.local` file in the root directory:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_API_URL=http://localhost:5000  # For local testing
     ```
   - Create a `.env` file in the `backend/` directory with Firebase service account credentials (from Firebase Console > Project Settings > Service Accounts > Generate New Private Key):
     ```
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
     FIREBASE_CLIENT_EMAIL=your-client-email
     ```

4. **Start the Backend Locally**:
   - Edit `backend/index.js`:
     - Uncomment lines 33-35 (local server listening on port 5000).
     - Comment line 38 (Lambda handler export).
   - Run:
     ```
     cd backend
     npm start
     ```
   - The server will run on `http://localhost:5000`.

5. **Start the Frontend**:
   ```
   npm run dev
   ```
   - Access the app at `http://localhost:3000`.

### Deployment

#### 1. Frontend (AWS Amplify)
Your frontend will be live at a URL like:
```
https://<your-app-id>.amplifyapp.com
```

- **Steps**:
  1. **Log in to AWS Amplify**:
     - Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home).
     - Sign in with your AWS credentials.
  2. **Connect Your GitHub Repository**:
     - Click **Get Started** under "Deploy" or **New app** > **Get started with an existing app**.
     - Select **GitHub** as the source provider.
     - Authorize Amplify to access your GitHub account if prompted.
     - Choose the repository `Bavi2002/Lithic-Labs` and the `main` branch.
     - Click **Next**.
  3. **Configure Build Settings**:
     - Verify:
       - **Build command**: `npm run build`
       - **Start command**: Leave blank
       - **Base directory**: `/` (root)
       - **Build output directory**: `.next`
     - Click **Next**.
  4. **Review and Deploy**:
     - Click **Save and deploy**.
     - Monitor build logs and note the live URL (e.g., `https://d1vpdb5bzhyjde.cloudfront.net`).
  5. **Set Environment Variables**:
     - Go to **App Settings** > **Environment variables**.
     - Add `NEXT_PUBLIC_*` variables from `.env.local` (update `NEXT_PUBLIC_API_URL` with the Lambda endpoint post-deployment).
     - Save and redeploy by committing a change.

#### 2. Backend (AWS Lambda via Serverless Framework)
The backend will be deployed as a Lambda function using the Serverless Framework.

- **Steps**:
  1. **Install Serverless CLI**:
     ```
     npm install -g serverless
     ```
     - Verify installation:
       ```
       serverless --version
       ```
  2. **Initialize Serverless in Your Backend**:
     - Navigate to the `backend/` directory:
       ```
       cd backend
       ```
     - Run:
       ```
       serverless
       ```
     - Choose the “AWS Node.js” template and name the service `car-rental-backend`.
     - This creates a `serverless.yml` file.
  3. **Install Dependencies**:
     ```
     cd backend
     npm install aws-serverless-express express cors
     ```
  4. **Convert `index.js` to Serverless**:
     - Edit `backend/index.js`:
       - Comment lines 33-35 (local server listening).
       - Uncomment line 38 (Lambda handler export).
     - Ensure the content matches:
       ```javascript
       import express from "express";
       import serverless from "aws-serverless-express";
       import carRoutes from "./routes/cars.js";
       import bookingRoutes from "./routes/bookings.js";
       import cors from "cors";

       const app = express();

       const allowedOrigins = [
         "http://localhost:3000",
         "https://main.d2og3p4plv5953.amplifyapp.com"
       ];

       app.use(cors({
         origin: (origin, callback) => {
           if (!origin || allowedOrigins.includes(origin)) {
             callback(null, true);
           } else {
             callback(new Error("Not allowed by CORS"));
           }
         },
         credentials: true
       }));

       app.use(express.json());
       app.use("/api/cars", carRoutes);
       app.use("/api/bookings", bookingRoutes);

       // For local testing (comment for deployment)
       // const port = process.env.PORT || 5000;
       // app.listen(port, () => console.log(`Server running on port ${port}`));

       // Export Lambda handler (uncomment for deployment)
       export const handler = serverless.createServer(app);
       ```
  5. **Update `serverless.yml`**:
     - Ensure it contains:
       ```yaml
       service: car-rental-backend

       provider:
         name: aws
         runtime: nodejs18.x
         region: us-east-1
         environment:
           NODE_ENV: lambda
           PORT: 5000

       functions:
         app:
           handler: index.handler
           events:
             - httpApi: '*'
       ```
  6. **Configure AWS Credentials**:
     - Create an IAM user with programmatic access and `AdministratorAccess`:
       - AWS Console > IAM > Users > Add user > Attach `AdministratorAccess`.
     - Configure credentials:
       ```
       aws configure
       ```
       - Enter AWS Access Key ID, AWS Secret Access Key, region (e.g., `us-east-1`), and output format (e.g., `json`).
  7. **Deploy the Backend**:
     ```
     cd backend
     serverless deploy
     ```
     - Note the endpoint (e.g., `https://<api-id>.execute-api.us-east-1.amazonaws.com`).
  8. **Update Frontend API URL**:
     - Update `.env.local`:
       ```
       NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com
       ```
     - Set `NEXT_PUBLIC_API_URL` in Amplify Console and redeploy via GitHub commit.



## Deployment Links
- **Frontend**: [https://main.d2og3p4plv5953.amplifyapp.com](https://main.d2og3p4plv5953.amplifyapp.com)
- **Backend**: [https://kmjme0uhvf.execute-api.us-east-1.amazonaws.com](https://kmjme0uhvf.execute-api.us-east-1.amazonaws.com)

