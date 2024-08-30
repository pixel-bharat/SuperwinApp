const jwt = require('jsonwebtoken');

const merchantId = process.env.MERCHANT_ID;


const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token verified:', decoded);
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};
module.exports = (req, res, next) => {
  const { 'x-merchant-id': merchantId } = req.headers;
  if (merchantId !== MERCHANT_ID) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
module.exports = authenticateToken;
