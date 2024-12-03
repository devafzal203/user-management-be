# User Management Application

A simple user management backend application that handles user authentication, profile management, and activity tracking. It includes the following key features:

## Features

#### 1. **User Signup, Login, and Logout**

- Users can **sign up**, **log in** securely, and **log out** of the application.
- Authentication is managed through **JWT** (JSON Web Tokens) for secure user sessions.

#### 2. **Profile Management**

- Users can **update their profile**, including:
  - **Name**: Modify the user's display name.
  - **Password**: Update the password with strong validation.
  - **Profile Picture**: Upload a new profile picture with proper validation and security.

#### 3. **Activity Tracking**

- All user actions (signup, login, logout, profile updates, password changes) are tracked in an **activity log**.
- Each action is logged with the following details:
  - **Action** performed (e.g., login, logout, profile update).
  - **Timestamp**: Date and time of the action.
  - **IP address** from which the action was performed.
- **User-Specific Activity History**: Users can view **only their own** activity logs to ensure privacy.

#### 4. **Data Privacy**

- User data is **securely isolated**, ensuring that one user cannot access the data or activity logs of another user.
- Activity logs are stored securely and are only accessible by the respective user.

#### 5. **Secure Authentication & Authorization**

- **Password hashing**: Passwords are hashed using industry-standard algorithms like **bcrypt** to ensure security.
- Secure authentication tokens (JWT or session-based) are used to maintain authenticated sessions.

## Tech Stack

- **Backend Framework**: Node.js & Express
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT/Session-based Authentication
- **Password Hashing**: bcrypt
- **File Storage**: Cloudinary for storing user profile pictures.

## Deployment

- The application is deployed on [Vercel](https://vercel.com/).
- Deployed URL: [https://user-management-be.vercel.app/](https://user-management-be.vercel.app/)

## Prerequisites

- Node.js (v14 or higher)
- Node Package Manager (npm)
- TypeScript

## Installation

```bash
# Clone the repository
git clone https://github.com/devafzal203/user-management-be.git
```

##x Navigate to project directory

```
cd user-management-be
```

## Setting Up Development Environment

1. Clone the repository
2. Install dependencies with `npm install`

3. Create `.env` file and add the following variables: PORT, DATABASE_URL, DIRECT_URL JWT_SECRET, REFRESH_TOKEN_SECRET, SESSION_SECRET, X_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, FRONTEND_URL
4. Start local development with `npm run dev`
5. Run tests with `npm test`

## Project Structure

```
user-management-be/
├── prisma/
│   ├── schema.prisma
├── src/
│   ├──__mocks__/
│   │   ├── cloudinary.ts
│   │   ├── prisma.ts
│   │   └── passport.ts
│   ├──__tests__/
│   │   ├── integration/
│   │   │   ├── auth.test.ts
│   │   │   └── user.test.ts
│   │   └── unit/
│   │   │   └── middlewares/
│   │   │   │    ├── apiKeyValidator.test.ts
│   │   │   │    └── authenticateOrRefresh.test.ts
│   │   │   ├──utils/
│   │   │   │   ├── jwtUtils.test.ts
│   │   │   │   └── trackUserActivity.test.ts
│   ├──controller/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── database/
│   │   └── prisma.client.ts
│   ├── middleware/
│   │   ├── apiKeyValidator.ts
│   │   ├── authMiddleware.ts
│   │   ├── authenticateOrRefresh.ts
│   │   └── uploadMiddleware.ts
│   ├── routes/
│   │   ├── auth.route.ts
│   │   ├── cron.route.ts
│   │   └── user.route.ts
│   ├── strategies/
│   │   ├── passport.ts
│   │   ├── passportGoogle.ts
│   │   └── passportLocal.ts
│   ├── test/
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   └── index.ts         # Main entry point
├── gitignore
├── cron.yaml
├── deploy.yaml
├── jest.config.ts
├── nodemon.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vercel.json
```

## Access the application:

Once the app is running, you can access the API via your preferred HTTP client (e.g., [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), [Insomnia](https://insomnia.rest/)) or through the frontend interface.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Postgres](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/)
- [Passport](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Nodemon](https://nodemon.io/)
- [Vercel](https://vercel.com/)
- [Jest](https://jestjs.io/)

## Author

Mohammad Afzal

### Note:

_This README provides a brief guide on how to get started, install dependencies, execute the code, test the code, and contribute to the project._
