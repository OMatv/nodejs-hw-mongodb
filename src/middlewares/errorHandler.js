
// eslint-disable-next-line no-unused-vars
export default function errorHandler (err, req, res, _next) {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err.status && err.expose) {
    res.status(err.status).json({
      status: err.status,
      message: err.message || 'Error',
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
