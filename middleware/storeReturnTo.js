const storeReturnTo = (req, res, next) => {
  if (req.session.return) {
    res.locals.return = req.session.return;
  }
  next();
};

module.exports = storeReturnTo;
