var message = function(err, res) {
  console.error(err.stack);
  res.status(500).send(err);
};

var handler = function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

module.exports = {
  message: message
};
