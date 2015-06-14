var message = function(err, res) {
  if (!err.stack) return res.status(404).send('nothing here');
  console.error(err.stack);
  res.status(500).json({ 'message': err.message });
};

var handler = function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

module.exports = {
  message: message
};
