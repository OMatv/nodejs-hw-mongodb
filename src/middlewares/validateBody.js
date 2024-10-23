import createHttpError from 'http-errors';

export default function validateBody(schema) {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        convert: false,
        abortEarly: false,
      });
      next();
    } catch (error) {
      const validateError = createHttpError(400, error.message);
      next(validateError);
    }
  };

  return func;
}
