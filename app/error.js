var message = function(err, res) {
  if (!err.message) return res.status(404).json({'message': 'nothing here'});
  if (process.env.NODE_ENV == 'development') {
    console.error(err.stack);
  }
  res.status(500).json({ 'message': err.message });
};


var notFound = function(err, res) {
  if (!err.message) return res.status(404).json({'message': 'nothing here'});
  if (process.env.NODE_ENV == 'development') {
    console.error(err.stack);
  }
  res.status(404).json({ 'message': err.message });
};

var handler = function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

module.exports = {
  message: message,
  notFound: notFound
};
