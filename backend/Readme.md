# QuizMaster Backend
    

## Description

This is the backend of QuizMaster, a comprehensive Quiz Application built using Node.js, Express, MongoDB, and Mongoose. It includes functionalities for user authentication, quiz management, quiz progress tracking, email service, reset-password and automatic quiz submission.

## Features

- User authentication (JWT-based)
- Quiz creation and management
- Progress tracking for quizzes
- Saving progress for incomplete quizzes
- Automatic submission of quizzes when the time limit is reached
- CORS enabled for cross-origin requests

## Folder Structure

```
QuizMaster
├── middleware
│   └── auth.js
├── models
│   ├── Quiz.js
│   ├── QuizProgress.js
│   └── QuizResult.js
├── node_modules
├── routes
│   ├── users.js
│   └── quizzes.js
├── .env
├── env_sample.txt
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern-quiz-app
JWT_SECRET=your_secret_key
EMAIL_USER=your_email_id
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:3000
```

## Routes

### User Routes

- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login a user

### Quiz Routes

- **POST** `/api/quizzes` - Create a new quiz
- **GET** `/api/quizzes/:id` - Get a specific quiz by ID
- **PUT** `/api/quizzes/:id` - Update a quiz by ID
- **DELETE** `/api/quizzes/:id` - Delete a quiz by ID
- **GET** `/api/quizzes` - Get all quizzes
- **GET** `/api/quizzes/stats/:id` - Get statistics for a specific quiz

## Additional Features

### Progress Saving

- Save quiz progress for users who have not yet completed the quiz.
- Automatically updates the elapsed time and progress as users work on the quiz.

### Auto-Submit Quiz

- Automatically submits quizzes that have reached their time limit.
- Computes the score and saves the results if the quiz is not manually submitted within the time frame.

## Usage

1. Install the dependencies
    ```sh
    npm install
    ```

2. Start the server
    ```sh
    npm start
    ```
   or for development
    ```sh
    npm run dev
    ```

3. The server will start on the port specified in the `.env` file. Default is `5000`.

---
