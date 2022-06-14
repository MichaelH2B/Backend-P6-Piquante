const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    // console.log("decodedToken =>");
    // console.log(decodedToken);
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'userID invalide';
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error,
      message: ('Echec Authentification')
    });
  }
};