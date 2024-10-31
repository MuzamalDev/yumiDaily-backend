const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token){
        return res.status(401).send({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: 'Invalid token' });
    }
};

// Role-based authorization middleware
const authorizeRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).send({ message: `Access denied. Required roles: ${roles.join(', ')}` });
    }
    next();
};

module.exports = { authMiddleware, authorizeRole };
