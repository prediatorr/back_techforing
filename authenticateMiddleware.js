import jwt from 'jsonwebtoken';
import User from './models/user.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) return res.sendStatus(403); // Forbidden

    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403); 
  }
};
