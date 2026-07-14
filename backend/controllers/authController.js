const jwt = require('jsonwebtoken');
const { User } = require('../models');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
