
import * as authServices from '../services/auth.js';


// const setupSession = (res, session) => {
//   // console.log('session.refreshTokenValidUntil:', session.refreshTokenValidUntil);
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + session.refreshTokenValidUntil),
//   });

//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + session.refreshTokenValidUntil),
//   });
// };

// const setupSession = (res, session) => {
//   console.log('session.refreshTokenValidUntil:', session.refreshTokenValidUntil);
//   const expires = new Date(Date.now() + session.refreshTokenValidUntil);

//   if (isNaN(expires.getTime())) {
//     throw new Error('Invalid expiration date');
//   }

//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: expires,
//   });

//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: expires,
//   });
// };

const setupSession = (res, session) => {
  console.log('session.refreshTokenValidUntil:', session.refreshTokenValidUntil);

  // Перевірте, чи є session.refreshTokenValidUntil числом або об'єктом Date
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
    expires: expires,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: expires,
  });
};
export const refreshController = async (req, res) => {

  const session = await authServices.refreshSession({
     sessionId: req.cookies.sessionId,
     refreshToken: req.cookies.refreshToken

  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session',
    data: {
      accessToken: session.accessToken,
    },
  });
};



export const registerController = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: newUser,
  });
};

export const loginController = async (req, res) => {
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
};


export const logoutController = async (req, res) => {

  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

