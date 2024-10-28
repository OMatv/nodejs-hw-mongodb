import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  // loginWithGoogleOAuthSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  // getGoogleOAuthUrlController,
  loginUserController,
  // loginWithGoogleController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetTokenController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetTokenController),
);
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);


// authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
// authRouter.post(
//   '/confirm-google-auth',
//   validateBody(loginWithGoogleOAuthSchema),
//   ctrlWrapper(loginWithGoogleController),
// );


authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post(
  '/logout',

  ctrlWrapper(logoutUserController),
);
authRouter.post(
  '/refresh',

  ctrlWrapper(refreshUserSessionController),
);
export default authRouter;
