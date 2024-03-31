const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const blogs = await Promise.all(
    blogData.map(blog => {
      const user = users[Math.floor(Math.random() * users.length)];
      return Blog.create({
        ...blog,
        user_id: user.id,
      });
    })
  );

  const comments = await Promise.all(
    commentData.map((comment, index) => {
      const blog = blogs[index % blogs.length]; // This will distribute comments among blogs
      return Comment.create({
        ...comment,
        blog_id: blog.id,
      });
    })
  );

  process.exit(0);
};

seedDatabase();
