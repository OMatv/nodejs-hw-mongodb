import * as authServices from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

const setupSession = (res, session) => {
  console.log('session.refreshTokenValidUntil:', session.refreshTokenValidUntil);

  let expires;
  if (typeof session.refreshTokenValidUntil === 'number') {
    expires = new Date(Date.now() + session.refreshTokenValidUntil);
  } else if (session.refreshTokenValidUntil instanceof Date) {
    expires = session.refreshTokenValidUntil;
  } else {
    throw new Error('Invalid type for refreshTokenValidUntil');
  }

  console.log('Calculated expiration date:', expires);

  if (isNaN(expires.getTime())) {
    throw new Error('Invalid expiration date');
  }

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires,
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires,
  });
};

export const refreshController = async (req, res, next) => {
  try {
    const session = await authServices.refreshSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const user = await authServices.register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user',
      data: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    console.log('Login attempt:', req.body);
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await authServices.logout(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await authServices.requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await authServices.resetPassword(req.body);
    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
