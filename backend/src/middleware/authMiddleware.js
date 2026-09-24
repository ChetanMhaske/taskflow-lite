const { verifyToken } = require('../utils/token');
const db = require('../db');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token missing or invalid format. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Authentication token not provided.',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'User belonging to this token no longer exists.',
      });
    }

    // Attach safe user profile without password_hash
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      message: 'Internal server error while verifying authentication.',
    });
  }
}

module.exports = {
  requireAuth,
};
