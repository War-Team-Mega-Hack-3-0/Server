module.exports = (req, res, next) => {
  console.log(req.requestContext);
  next();
};
