const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register/create new user
const register = async (req, res) => {
    try {
        const { name, email, password, role, address=undefined } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role, address });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).send({ message: 'Registration failed', error: error.message });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user){ return res.status(400).send({ message: 'Invalid credentials' });}

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){ return res.status(400).send({ message: 'Invalid credentials' });}

        const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.send({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).send({ message: 'Login failed', error: error.message });
    }
};

// Get all users in descending order
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.send({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving users', error: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user){ return res.status(404).send({ message: 'User not found' });}
        res.send({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving user', error: error.message });
    }
};

module.exports = { getAllUsers, getUserById, login, register };
