const { generateToken } = require('../middleware/jwtMiddleware');
const { User } = require('../models/user');
const mongoose = require('mongoose');

const validateUserData = (name, email) => {
    if (!name || !email) {
        return { valid: false, message: 'Invalid input' };
    }
    if (typeof name !== 'string' || typeof email !== 'string') {
        return { valid: false, message: 'Invalid input' };
    }
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(200).json({ message: 'List is empty' });
        }
        res.status(200).json({ message: 'List of users', users });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: `User with ID: ${userId}`, user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getUserByToken = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: `User with ID: ${userId}`, user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error token' });
    }
};

const createUser = async (req, res) => {
    const { name, email } = req.body;
    const validation = validateUserData(name, email);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }
    try {
        const newUser = new User({ name, email });
        const user = await newUser.save();
        const token = generateToken(user);
        res.status(201).json({ message: 'User created', user, token });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const validation = validateUserData(name, email);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }
    try {
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: `User with ID: ${userId} deleted` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByToken
};