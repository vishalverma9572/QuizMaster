# Contribution Guide

Thank you for your interest in contributing to **QuizMaster**! We welcome all contributions, whether it's fixing bugs, improving documentation, adding new features, or optimizing the code.

### 💬 Join the Conversation on GitTalks

I’m active on **GitTalks**, a Discord community for developers, where we share knowledge, collaborate on projects, and discuss the latest in tech. Join us to connect with like-minded individuals!

[![Discord](https://img.shields.io/badge/Join%20Us%20on%20Discord-7289DA?style=flat&logo=discord&logoColor=white)](https://discord.gg/2bk8FCeN)




Here's how you can get started:

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Setting Up Environment Variables](#setting-up-environment-variables)
  - [Running the Application](#running-the-application)
- [Where You Can Contribute](#where-you-can-contribute)
- [Steps to Contribute](#steps-to-contribute)
- [Working on Original Branch](#working-on-original-branch)
- [Need Help?](#need-help)

## Getting Started

To start contributing, you need to set up the project on your local machine.

### Installation

1. **Fork the repository:**
   - Click the fork button at the top right of the repository page.

2. **Clone the repository:**
   ```bash
   git clone https://github.com/your_username/repo_name
   ```

3. **Navigate to the `quiz-maker` directory:**
   ```bash
   cd quiz-maker
   ```

4. **Install frontend dependencies:**
   ```bash
   npm i
   ```

5. **Navigate to the `backend` directory:**
   ```bash
   cd ../backend
   ```

6. **Install backend dependencies:**
   ```bash
   npm i
   ```

### Setting Up Environment Variables

#### Backend

1. In the `backend` directory, create a `.env` file and add the following:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mern-quiz-app
   JWT_SECRET=secret_key
   EMAIL_USER=email_id
   EMAIL_PASSWORD=Your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

   - You can set up `EMAIL_USER` and `EMAIL_PASSWORD` using Gmail API or leave it if you don't want to work on the email feature.

#### Frontend

1. In the `quiz-maker` subdirectory, create a `.env` file and add the following:
   ```bash
   REACT_APP_BACKEND_URL=http://localhost:5000/api
   REACT_APP_FRONTEND_URL=http://localhost:3000
   ```

### Running the Application

1. **Backend:**
   - To start the backend server, run:
     ```bash
     npm start
     ```
   - For development mode, you can use:
     ```bash
     npm run dev
     ```

2. **Frontend:**
   - Navigate to the `quiz-maker` subdirectory and start the frontend by running:
     ```bash
     npm start
     ```
   - If you encounter infinite loading, try clearing your browser's local storage for `localhost:3000`.

## Where You Can Contribute

Here are some areas where you can contribute:

- **Documentation:** Improve existing documentation or add new ones.
- **UI Fixes:** Resolve UI-related bugs or improve design elements.
- **New Features:** Add new features or views.
- **Responsiveness:** Make the app more responsive for various screen sizes.
- **Backend Optimization:** Fix bugs or optimize code in the backend.
- **Propose Features:** Propose a completely new feature for the app.

## Steps to Contribute

1. **Find bugs or a new feature:**
   - Look for bugs or suggest new features you would like to implement.

2. **Create an Issue:**
   - Open an issue describing the bug or feature. If approved, I will assign it to you.

3. **Work on the Issue:**
   - Once assigned, start working on it and follow the project's code style.

4. **Create a Pull Request (PR):**
   - Submit a detailed PR with an explanation of the changes. Attach images if possible.

## Working on Original Branch

Alternatively, if you prefer, you can work on the original branch and submit changes via a pull request.

## Need Help?

If you're facing any issues or need assistance, feel free to:

- **Open an issue:** Create an issue in the repository for support.
- **Contact me via email:** For urgent issues, you can reach me at [vishalverma9572@gmail.com].

---

This should provide a clear and structured contribution guide, making it easier for others to contribute!
