const getTestMessage = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API test route is working'
  });
};

module.exports = {
  getTestMessage
};
