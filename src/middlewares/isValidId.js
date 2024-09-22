import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export default function isValidId(req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createHttpError(404, `${id} not valid id`));
  }
  next();
}
