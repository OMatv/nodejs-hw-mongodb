
export default function errorHandler  (error, req, res) {
  const {status = 500, message} = error;
  res.status(status).json({
      message,
  });
};


