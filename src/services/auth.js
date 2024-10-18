import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import SessionsCollection  from '../db/models/Session.js';
import UsersCollection  from '../db/models/User.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

// Функція створення нової сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

// Функція для реєстрації нового користувача
export const registerUser = async (payload) => {
  try {

    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) {
      throw createHttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);
    const data = await UsersCollection.create({
      ...payload,
      password: hashPassword,
    });
    delete data._doc.password;

    return data._doc;
  } catch (error) {
    console.error('Error during register:', error);
    throw error;
  }
};

// Функція для авторизації користувача
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);//порівнюємо хеші паролів
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

// Функція для пошуку сесії по access токену
export const findSessionByAccessToken = (accessToken) =>
  SessionsCollection.findOne({ accessToken });

// Функція для оновлення сесії на основі refresh токену
export const refreshSession = async ({ sessionId,refreshToken }) => {

  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
 const isSessionTokenExpired = new Date() >new Date(session.refreshTokenValidUntil);
 if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionsCollection.create({userId: session.userId,...newSession,});
};

// Функція для виходу з сесії
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// Функція для пошуку користувача за фільтром
export const findUser = (filter) => UsersCollection.findOne(filter);
