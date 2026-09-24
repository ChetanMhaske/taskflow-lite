const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      message: 'Email is required.',
      field: 'email',
    });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      message: 'Please provide a valid email address.',
      field: 'email',
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      message: 'Password is required.',
      field: 'password',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long.',
      field: 'password',
    });
  }

  next();
}

module.exports = {
  validateLoginInput,
};
