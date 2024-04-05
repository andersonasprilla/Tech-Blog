const router = require('express').Router();
const { Blog, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

// @desc    Fetch all Blogs
// @route   GET http://localhost:3001/
// @access  Public
router.get('/', async (req, res) => {
  try {

    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// @desc    Fetch Blog by id
// @route   GET http://localhost:3001/blog/:id
// @access  Private (requires authentication)
router.get('/blog/:id', withAuth, async (req, res) => {
  try {
    // Fetch the blog by id from the database, including the user who created it and its comments
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'], 
        },
        {
          model: Comment,
          attributes: ['comment_description', 'date_created'], // Assuming these are the relevant fields for comments
        },
      ],
    });

    // If the blog doesn't exist, return a 404 error
    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    // Serialize the data
    const blog = blogData.get({ plain: true });


    // Render the blog page with the fetched blog data
    // Assuming the template is named 'blog', replace it with the actual template name if different
    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in // Pass the logged_in status to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});




//http://localhost:3001/dashboard
// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




//http://localhost:3001/login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

//http://localhost:3001/login
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

//http://localhost:3001/page1
router.get("/page1", async (req, res) => {
  res.render("page1")
})

module.exports = router;
