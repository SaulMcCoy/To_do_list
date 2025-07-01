//Using this file to create the server. 
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())//Reads things as a json file.
const PORT = process.env.PORT || 3000;// local port number 
const Todo = require('./models/Todo.js');//This is how call the Todo class into main.  
const cors = require('cors');
const path = require('path');
app.use(cors({
  origin: "https://todo-list-ye8a.onrender.com"
}));
app.use(express.static(path.join(__dirname,'public')));

console.log('Todo is:', Todo);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


//Routes:  
//If there is nothing after the /
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

//This is the backend in async 
//This try catch block cheacks to see if it is conected or not and throws error if not. 
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//CRUD
//Create, can use something called post
app.post('/todos', async(req,res) => {
  try{
    const {task, completed} = req.body; // what ever the request is becomes the task
    const newTodo = new Todo({task, completed}); 
    console.log(req.body)
    const saved = await newTodo.save(); //Saves the new list items
    res.json(saved);
  } catch(err){
    res.status(400).json({error: err.message }); //400 means something is wrong with req
  }
})

//Update
//Delete
app.delete('/todos/:id', async(req,res) => {
  try{
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted){
      res.status(404).json({message: "ID not found."})
    }
    console.log(deleted);
    res.json({message: `You have deleted ${req.params.id}.`})
  } catch(err){
    res.status(500).json({error: err.message})
  }
})

//Start server
app.listen(PORT,()=>{
   console.log(`Server is running at http://localhost:${PORT}`);
})