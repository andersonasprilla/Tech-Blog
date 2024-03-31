const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// @desc    Fetch all Blogs
// @route   GET /api/blogs/
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogsData = await Blog.findAll({
      include: [{ 
        model: Comment,
        attributes: ['comment_description', 'date_created']

       }]
    })
    res.status(200).json(blogsData)
  } catch (err) {
    res.status(400).json(err);
  }
});

// @desc    Create a  Blog
// @route   GET /api/blogs/
// @access  Public
router.post('/', withAuth, async (req, res) => {
  // Example validation logic
  if (!req.body.title || !req.body.blog_description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }
  try {
    // Create the new blog
    const newBlog = await Blog.create({
      ...req.body, // Consider replacing with sanitized data
      user_id: req.session.user_id,
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating new blog:', err);

    // Customize error response based on the error type
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'An error occurred while creating the blog. Please try again later.' });
  }
});

// @desc    Delete a Blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // Optionally verify that the blog exists and the user has the right to delete it
    const blog = await Blog.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: 'No blog found with this id!' });
    }

    // Check if the user is the owner of the blog or has admin rights if applicable
    if (blog.user_id !== req.session.user_id) {
      return res.status(403).json({ message: 'User is not authorized to delete this blog.' });
    }

    // Proceed with deletion
    await blog.destroy();
    res.status(200).json({ message: 'Blog successfully deleted.' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'An error occurred while deleting the blog. Please try again later.' });
  }
});


module.exports = router;
