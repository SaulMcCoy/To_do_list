//Using this file to create the server. 
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;// local port number 
const Todo = require('./models/Todo.js');

console.log('Todo is:', Todo);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json())//Reads things as a json file.
//Routes:  
app.get('/',(req,res)=>{
    res.send('Hello from the backend. :)')
})

//In json format.

 
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Start server
app.listen(PORT,()=>{
   console.log(`Server is running at http://localhost:${PORT}`);
})