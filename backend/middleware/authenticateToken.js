const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      console.log('No token provided');
      return res.sendStatus(401); // If no token, return 401 Unauthorized
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token verification failed', err);
        return res.sendStatus(403); // If token is not valid, return 403 Forbidden
      }
      req.user = user;
      next();
    });
  };
  