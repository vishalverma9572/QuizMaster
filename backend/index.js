const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const Quiz = require("./models/Quiz");

const QuizResult = require("./models/QuizResult");
const QuizProgress = require("./models/QuizProgress");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middleware/errorController");

const Message = require("./models/messageModel");
const Conversation = require("./models/conversationModel"); //FOR chatbot with socket.io
const socketIo = require("socket.io");

//auto submit quiz
async function autoSubmitQuizzes() {
  try {
    const quizProgressList = await QuizProgress.find({ completed: false });

    for (const quizProgress of quizProgressList) {
      const quiz = await Quiz.findOne({ quiz_id: quizProgress.quiz_id });

      if (!quiz) continue;

      const elapsedTime =
        (Date.now() - quizProgress.lastUpdated.getTime()) / 1000; // Time in seconds
      const totalElapsedTime = quizProgress.elapsedTime + elapsedTime;

      if (totalElapsedTime >= quiz.timeLimit * 60) {
        // Time limit reached, auto-submit quiz
        quizProgress.elapsedTime = totalElapsedTime;
        quizProgress.completed = true;

        let score = 0;
        const answersWithCorrectness = quizProgress.answers.map((answer) => {
          const question = quiz.questions.id(answer.question_id);
          const isCorrect = question.correctAnswer === answer.selectedOption;
          if (isCorrect) score += 1;
          return {
            ...answer,
            isCorrect,
          };
        });

        // Check if quiz is already taken by this user
        const quizResultExists = await QuizResult.findOne({
          quiz_id: quizProgress.quiz_id,
          user_id: quizProgress.user_id,
        });
        if (quizResultExists) {
          console.log(
            `Quiz ${quizProgress.quiz_id} already taken by user ${quizProgress.user_id}`
          );
          continue; // Skip further processing
        }

        // Save QuizResult
        const quizResult = new QuizResult({
          quiz_id: quizProgress.quiz_id,
          user_id: quizProgress.user_id,
          score,
          answers: answersWithCorrectness,
        });

        await quizResult.save();

        // Update Quiz takenBy if the user hasn't already taken it
        if (!quiz.takenBy.includes(quizProgress.user_id)) {
          quiz.takenBy.push(quizProgress.user_id);
          await quiz.save();
        }
      } else {
        // Time limit not reached, update elapsedTime
        quizProgress.elapsedTime = totalElapsedTime;
      }

      // Save the quiz progress
      quizProgress.lastUpdated = new Date();
      await quizProgress.save();
    }
  } catch (err) {
    console.error("Error in autoSubmitQuizzes:", err);
  }
  console.log("autoSubmitQuizzes ran");
}

// Periodically check every minute
setInterval(autoSubmitQuizzes, 60 * 1000);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret key
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production' ? true : false,
      }, // Set secure to true in production with HTTPS
    })
  );

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/", (req, res) => res.send("Hello World!"));

app.all("*", (req, res, next) => {
  next(new AppError(`Cant Find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler); // Error Handlers
const PORT = process.env.PORT || 5000;
console.log(PORT);
//print req res status
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Setting UP chatbot

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");

  // Join the user to a room based on their userId
  socket.on("joinRoom", (userId) => {
    socket.join(userId); // User joins their own room using userId
    console.log(`User with ID ${userId} joined room ${userId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    const msg = new Message({
      conversationId: conversation._id, // Use MongoDB generated _id for conversationId
      senderId,
      receiverId,
      message,
    });
    console.log("this is an image", msg);

    await msg.save();

    socket.to(receiverId).emit("newMessage", msg);
    socket.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
