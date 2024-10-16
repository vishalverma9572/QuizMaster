# QuizMaster Frontend

## Description

QuizMaster is a comprehensive quiz application that allows users to create, take, and manage quizzes. The frontend is built using React and provides a smooth and interactive user experience. This application includes features such as user authentication, quiz management, progress tracking, and viewing detailed quiz statistics.

## Features

- **User Authentication:** Sign In, Sign Up
- **Dashboard Navigation:** My Tests, My Results, Create Test, Take Test, Profile, Logout
- **Quiz Management:** Create, Edit, Delete quizzes
- **Progress Tracking:** Save progress, auto-submit quizzes after time limit is reached
- **Detailed Statistics:** View quiz results, detailed statistics, and ranking of users
- **Responsive Design:** Ensures compatibility across various devices

## Folder Structure

```
QuizMaster
├── node_modules
├── public
├── src
│   ├── Authorisation.css
│   ├── Authorisation.js
│   ├── CreateTest.css
│   ├── CreateTest.js
│   ├── DashBoard.css
│   ├── DashBoard.js
│   ├── EditQuiz.css
│   ├── EditQuiz.js
│   ├── ForGotPassword.js
│   ├── Home.css
│   ├── Home.js
│   ├── Loader.css
│   ├── Loader.js
│   ├── MyResults.css
│   ├── MyResults.js
│   ├── MyTests.css
│   ├── MyTests.js
│   ├── PageLoader.css
│   ├── PageLoader.js
│   ├── Profile.css
│   ├── Profile.js
│   ├── QuizCard.jsx
│   ├── QuizDetails.css
│   ├── QuizDetails.js
│   ├── ResetPassword.js
│   ├── ResultPage.css
│   ├── Resultpage.js
│   ├── Resultstats.css
│   ├── ResultStats.js
│   ├── TakeTest.css
│   ├── TakeTest.js
│   ├── TestPage.css
│   ├── TestPage.js
│   ├── UserScorestable.css
│   ├── UserScorestable.js
├── .env
├── .gitignore
├── env_sample.txt
├── package-lock.json
├── package.json
├── README.md
```

## Pages and Components

### Home Page
- **Sign In** and **Sign Up** buttons
- If logged in, shows a **Go to Dashboard** button

### Dashboard
- Navigation options:
  - My Tests
  - My Results
  - Create Test
  - Take Test
  - Profile
  - Logout

### My Tests
- Displays all tests created by the user
- Each quiz card has options to view details and share the quiz
- **Details Page:** Includes buttons to view stats, edit, or delete the quiz

### Edit Quiz Page
- Allows editing of quiz details and questions

### Show Stats Page (ResultPage)
- Displays statistical data such as min, max, median, upper quartile, lower quartile in bar graph
- Pagination for ranking of all users who have taken the quiz

### My Results Page
- Displays all tests taken by the user along with their scores
- Button to view detailed stats, redirecting to the ResultPage

### Create Test Page
- Allows users to create a new test by adding questions and setting a time limit

### Profile Page
- Allows users to change their username and password

### Take Test Page
- Users can search for a test by ID
- Displays a card with test details and a button to attempt the test

### Test Page
- Shows instructions for the test
- Users can access the test if the status is not taken or in progress

## Environment Variables

- **REACT_APP_BACKEND_URL:** `http://localhost:5000/api`
- **REACT_APP_FRONTEND_URL:** `http://localhost:3000`

## Usage

1. Install the dependencies
    ```sh
    npm install
    ```

2. Start the development server
    ```sh
    npm start
    ```

3. The application will start on `http://localhost:3000`

## Notes

- Ensure the backend server is running and connected to the MongoDB database for full functionality.
- Customize environment variables as needed for your setup.


### Firebase Setup Instructions

To use Firebase in this project, the moderator must create their own Firebase project and add the configuration details in a .env file.

Step 1: Create a Firebase Project
1.Go to the Firebase Console.
2.Click "Add project" and follow the setup instructions to create a new Firebase project.
3.Once the project is created, go to Project Settings (click on the gear icon next to "Project Overview").
4.Scroll down to the "Your apps" section and click on "Add app" (choose the web icon </> for web apps).
5.Firebase will provide you with the configuration details like apiKey, authDomain, etc.

Step 2: Add Firebase Configuration to .env File
In the root directory of the project, create a .env file.
Follow the format provided in the .env.example file to structure your .env file. You can copy the structure from .env.example and fill in your own Firebase credentials.

Example format for .env file:


FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
Replace the placeholders (e.g., your_firebase_api_key) with the actual values from your Firebase project.

Step 3: Verify .env File

Ensure that your .env file is properly configured and located in the root directory of the project. The structure of the .env file should exactly match the .env.example format, but with your own Firebase credentials.

Step 4: Running the Application

Once the .env file is set up with your Firebase credentials in the correct format, you can run the project with:

Run this in your project directory:

npm install firebase react-router-dom axios react-password-strength-bar
npm install dotenv
npm start
This will automatically load the Firebase configuration from your .env file.