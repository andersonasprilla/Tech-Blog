const router = require('express').Router();
const { User } = require('../../models');

// @desc    Fetch  users
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password']}
    });
    if (userData) {
      // Send back the user data with a 200 OK status code
      res.status(200).json(userData);
    } else {
      // If no users found, you can choose to send a 404 Not Found status
      res.status(404).json({ message: 'No users found' });
    }
  } catch (err) {
    // Log the error to the server console for debugging
    console.error('Error fetching users:', err);
    // Send back a 400 Bad Request status code with the error
    res.status(400).json(err);
  }
});

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res.status(200).json({ user: newUser, message: 'Registration successful!' });
    });
  } catch (err) {
    // If the error is due to a unique constraint (email already exists), send a specific error message
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'An account with this email already exists.' });
    } else {
      console.error('Error during user signup:', err);
      res.status(400).json(err);
    }
  }
});

// @desc    Sign in user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// @desc    Logout User
// @route   POST /api/users/logout
// @access  Public
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // Attempt to destroy the session
    req.session.destroy((err) => {
      if (err) {
        // Log the error and send a 500 Internal Server Error response
        console.error('Session destruction error:', err);
        res.status(500).json({ message: 'Error logging out, please try again later.' });
      } else {

        // Send a 200 OK status with a message confirming logout
        res.status(200).json({ message: 'Logout successful.' });
      }
    });
  } else {
    // If the user is not logged in, provide a more informative message
    res.status(404).json({ message: 'No active session to log out from.' });
  }
});

module.exports = router;

