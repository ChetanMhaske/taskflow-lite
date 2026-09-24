const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken } = require('../utils/token');

async function authenticate(email, password) {
  const user = await db.findUserByEmail(email);
  if (!user) {
    // Avoid revealing whether a specific email exists
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return null;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };

  return {
    user: safeUser,
    token,
  };
}

async function getUserProfile(userId) {
  const user = await db.findUserById(userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
}

module.exports = {
  authenticate,
  getUserProfile,
};
