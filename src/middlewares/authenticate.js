import createHttpError from 'http-errors';
import SessionsCollection from '../db/models/Session.js';
import UsersCollection from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    console.log('Authorization header not provided');
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    console.log('Auth header is not valid');
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  console.log('Session found:', session);

  if (!session) {
    console.log('No session found for token:', token);
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    console.log('Access token expired for token:', token);
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    console.log('User not found for session:', session._id);
    return next(createHttpError(401));
  }

  req.user = user;
  next();
};



