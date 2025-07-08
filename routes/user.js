const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser, getUserByToken } = require('../controllers/user');
const { jwtMiddleware } = require('../middleware/jwtMiddleware');

router.get('/', jwtMiddleware, getUsers);
router.get('/profile', jwtMiddleware, getUserByToken);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;