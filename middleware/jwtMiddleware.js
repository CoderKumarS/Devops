const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;
const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token Not Found' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, name: user.name, email: user.email }, secret);
}
module.exports = { jwtMiddleware, generateToken };