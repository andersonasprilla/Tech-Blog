const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// @desc    Fetch comments for a blog post
// @route   GET /api/comments/:blogId
// @access  Private
router.get('/:blogId', withAuth, async (req, res) => {
  try {
    const commentsData = await Comment.findAll({
      where: {
        blog_id: req.params.blogId,
      },
    });
    res.status(200).json(commentsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc    Create a comment
// @route   POST /api/comments/
// @access  Private
router.post('/', withAuth, async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.status(403).json({ message: 'User must be logged in to comment' });
      return;
    }

    const newComment = await Comment.create({
      comment_description: req.body.comment_description,
      blog_id: req.body.blog_id,
      // Assuming a 'user_id' field exists in your session to identify the logged-in user
      user_id: req.session.user_id,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const comment = await Comment.destroy({
      where: {
        id: req.params.id,
        // Optionally, ensure the user deleting the comment is the one who posted it or has admin rights
        user_id: req.session.user_id,
      },
    });

    if (!comment) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Comment deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
