const fs = require('fs');

const deletePreviousAvatar = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(400).json({ error: 'User field not present in request body' });
  }

  if(user.profileImage) {
    fs.unlink(user.profileImage, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting file' });
      }
    });
  }

  next();
};

module.exports = deletePreviousAvatar;