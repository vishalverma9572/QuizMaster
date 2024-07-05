const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {  }) .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/',(req,res)=>res.send('Hello World!'));
const PORT = process.env.PORT || 5000;
//print req res status
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

