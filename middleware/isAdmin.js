const isAdmin = (req, res, next) => {
    // Check if user is logged in and isAdmin flag is true
    if (req.user && req.user.isAdmin) {
      // User is admin, proceed to the next middleware/route handler
      next();
    } else {
      // User is not an admin, return unauthorized status
      res.status(401).json({ message: 'Unauthorized access' });
    }
  };
  
  module.exports = isAdmin;
  