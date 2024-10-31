const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, login, register } = require('../controllers/userController');
const { authMiddleware, authorizeRole } = require('../middlewares/authenticate');

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers); 
router.get('/:id', getUserById); 

module.exports = router;
