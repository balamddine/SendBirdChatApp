const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); 
const users = require('./endpoints/users');
const app = express();
const PORT = process.env.PORT || 3001;
const http = require('http').createServer(app);

app.use(express.static('dist'));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is the chat project server.")
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Use the routes defined in routes.js
app.use('/', users);
