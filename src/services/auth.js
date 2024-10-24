/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import SessionsCollection from '../db/models/Session.js';
import UsersCollection from '../db/models/User.js';
import { accessTokenLifetime, refreshTokenLifetime } from '../constants/users.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

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

// Функція для оновлення сесії на основі refresh токену
export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionsCollection.create({ userId: session.userId, ...newSession });
};

// Функція для реєстрації нового користувача
export const register = async ({ email, password, ...rest }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({ email, password: hashedPassword, ...rest });
  delete newUser._doc.password;

  return newUser._doc;
};

// Функція для авторизації користувача
export const login = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });
  const sessionData = createSession();
  return await SessionsCollection.create({ userId: user._id, ...sessionData });
};

// Функція для пошуку сесії по access токену
export const findSessionByAccessToken = (accessToken) =>
  SessionsCollection.findOne({ accessToken });

// Функція для виходу з сесії
export const logout = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// Функція для пошуку користувача за фільтром
export const findUser = (filter) => UsersCollection.findOne(filter);

// Функція для запиту токену для скидання паролю
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), { expiresIn: '5m' });

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password.html');
  const templateSource = (await fs.readFile(templatePath)).toString();
  const template = handlebars.compile(templateSource);
  const html = template({ name: user.name, link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}` });

  await sendEmail({ from: env(SMTP.SMTP_FROM), to: email, subject: 'Reset your password', html });
};

// Функція для скидання паролю
export const resetPassword = async ({ token, password }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await UsersCollection.findOne({ email: decoded.email, _id: decoded.sub });
  if (!user) throw createHttpError(404, 'User not found');

  const hashedPassword = await bcrypt.hash(password, 10);
  await UsersCollection.updateOne({ _id: user._id }, { password: hashedPassword });
};
