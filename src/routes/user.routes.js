// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const User = require('../models/user.model');

router.get('/users', async (req, res) => {
  try {
    const userModel = new User(pool);
    const users = await userModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const userModel = new User(pool);
    const user = await userModel.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const userModel = new User(pool);
    const userId = await userModel.create(req.body);
    res.status(201).json({ id: userId, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userModel = new User(pool);
    const success = await userModel.update(req.params.id, req.body);
    if (success) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userModel = new User(pool);
    const success = await userModel.delete(req.params.id);
    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;