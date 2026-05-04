const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

let users = require('./MOCK_DATA.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- RENDER DASHBOARD ---------- */
app.get('/', (req, res) => {
  res.render('index');
});

/* ---------- GET ALL USERS ---------- */
app.get('/users', (req, res) => {
  res.json(users);
});

/* ---------- GET USER BY ID ---------- */
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

/* ---------- CREATE USER ---------- */
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    gender: req.body.gender,
    job_title: req.body.job_title
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/* ---------- UPDATE USER ---------- */
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const filePath = path.join(__dirname, 'MOCK_DATA.json');

  let users = JSON.parse(fs.readFileSync(filePath));

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body
  };

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.json(users[userIndex]);
});

/* ---------- DELETE USER ---------- */
const fs = require('fs');


app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const filePath = path.join(__dirname, 'MOCK_DATA.json');

  let users = JSON.parse(fs.readFileSync(filePath));

  const newUsers = users.filter(user => user.id !== id);

  if (users.length === newUsers.length) {
    return res.status(404).json({ message: "User not found" });
  }

  fs.writeFileSync(filePath, JSON.stringify(newUsers, null, 2));

  res.json({ message: "User deleted successfully" });
});

/* ---------- SERVER ---------- */
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});