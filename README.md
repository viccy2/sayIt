# sayIt - Backend 

TypeScript-powered API for language detection, short definitions, and user history tracking.

## 🛠 Tech Stack
- **Runtime:** Node.js / TypeScript
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **AI:** Google Generative AI (Gemini)
- **Auth:** JWT (JSON Web Tokens)

## 📂 Structure
- `/src/controllers`: Logic for AI analysis & user auth.
- `/src/models`: Schemas for User and History.
- `/src/middleware`: Auth guard for protected routes.
- `/src/services`: Gemini AI integration.

## 🚀 Setup
1. `npm install`
2. Create `.env`:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_url`
   - `JWT_SECRET=your_secret_key`
   - `GEMINI_API_KEY=your_google_key`
3. `npm start`

## 📡 Key Endpoints
- `POST /auth/register` - Create account
- `POST /analyze` - AI language analysis
- `GET /history` - Retrieve user practice list
