import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';

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
export const signup = async (payload) => {
  try {
    const { email, password } = payload;
    const user = await UserCollection.findOne({ email });
    if (user) {
      throw createHttpError(409, 'Email already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const data = await UserCollection.create({
      ...payload,
      password: hashPassword,
    });
    delete data._doc.password;

    return data._doc;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error; // Піднімаємо помилку вище для глобального обробника
  }
};

// Функція для авторизації користувача
export const signIn = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

// Функція для пошуку сесії по access токену
export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

// Функція для оновлення сесії на основі refresh токену
export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });

  return userSession;
};

// Функція для видалення сесії
export const signOut = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

// Функція для пошуку користувача за фільтром
export const findUser = (filter) => UserCollection.findOne(filter);
