const express = require('express');
const app= express();
const connectDB = require('./db')


// express

//body parser
app.use(express.json());

const PORT = 5173;


connectDB()