const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const connectDb=mongoose.connect('mongodb://localhost/taskdb').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', taskRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
