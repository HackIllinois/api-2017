module.exports = (req, res, next) => {
  console.log(req.url);
  return next();
};