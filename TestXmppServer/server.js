// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log("------------------------------------------------");  
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("------------------------------------------------");
});
