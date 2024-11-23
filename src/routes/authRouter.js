// gen imports
import { Router } from "express";

// custom imports
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerController, refreshUserController, resetPasswordController, refreshUserController, loginUserController, logoutUserController, doResetPasswordController } from "../controllers/auth.js";
import { userLoginSchema, userValidationSchema, resetPasswordSchema, doResetPasswordSchema } from "../validation/auth.js";

// server code
const router = Router();

router.post('/register', validateBody(userValidationSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-email', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
router.post('/reset-pwd', validateBody(doResetPasswordSchema), ctrlWrapper(doResetPasswordController));

export default router;
