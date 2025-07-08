let users = [];

function validateUserData(name, email) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'Invalid input' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return { valid: false, message: 'Invalid input' };
    }
    return { valid: true };
}

const getUsers = (req, res) => {
    if (users.length === 0) {
        return res.status(200).json({
            message: 'List is empty'
        });
    }
    res.status(200).json({
        message: 'List of users',
        users
    });
};

const getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.status(200).json({
            message: `User with ID: ${userId}`,
            user
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

const createUser = (req, res) => {
    const { name, email } = req.body;
    const validation = validateUserData(name, email);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    users.push(newUser);
    res.status(201).json({
        message: 'User created',
        user: newUser
    });
};

const updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    const validation = validateUserData(name, email);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = {
            id: userId,
            name,
            email
        };
        res.status(200).json({
            message: `User with ID: ${userId} updated`,
            user: users[index]
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

const deleteUser = (req, res) => {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({
            message: 'Invalid user ID'
        });
    }
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        res.status(200).json({
            message: `User with ID: ${userId} deleted`
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
