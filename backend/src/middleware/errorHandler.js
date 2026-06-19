export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Node's fetch throws a generic "fetch failed"; the real reason lives on
  // err.cause (e.g. TLS/cert or DNS errors). Surface it so failures are
  // diagnosable instead of opaque.
  const cause = err.cause?.code || err.cause?.message;
  const message = err.message || 'Internal server error';

  console.error('[error]', message, cause ? `(cause: ${cause})` : '');

  res.status(statusCode).json({
    message,
    ...(cause ? { cause } : {}),
  });
}
