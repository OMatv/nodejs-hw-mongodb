import express from 'express';
import { register } from '../services/auth.js';

// import { Router } from 'express';

import * as authControllers from '../controllers/auth.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';

import {
  userSignupSchema,
  userSignInSchema,
  userRegisterSchema,
} from '../validation/users.js';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateBody(userSignupSchema),
  ctrlWrapper(authControllers.signupController),
);

authRouter.post(
  '/signIn',
  validateBody(userSignInSchema),
  ctrlWrapper(authControllers.signInController),
);

authRouter.post(
  '/register',
  register,
  validateBody(userRegisterSchema),
  ctrlWrapper(authControllers.register),
);
authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

authRouter.post('/signOut', ctrlWrapper(authControllers.signOutController));

export default authRouter;
