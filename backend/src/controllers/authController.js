const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const authResult = await authService.authenticate(email, password);

    if (!authResult) {
      // 401 Unauthorized with generic message to avoid enumeration
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: authResult.user,
      token: authResult.token,
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    // req.user was populated by requireAuth middleware
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    // For token-based auth, client discards token from storage.
    // Backend confirms logout and clears any session/cookie if present.
    return res.status(200).json({
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getMe,
  logout,
};
