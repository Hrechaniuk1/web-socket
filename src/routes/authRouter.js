// gen imports
import { Router } from "express";

// custom imports
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { validateBody } from "../middleware/validateBody.js";
import { registration } from "../middleware/registration.js";
import { registerController,
    // resetPasswordController,
     refreshUserController, loginUserController, logoutUserController,
    //  doResetPasswordController
     } from "../controllers/auth.js";
import { userLoginSchema, userValidationSchema,
    // resetPasswordSchema, doResetPasswordSchema
} from "../validation/auth.js";

// server code
const authRouter = Router();

authRouter.post('/register', validateBody(userValidationSchema), registration, ctrlWrapper(registerController));
authRouter.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
// authRouter.post('/send-reset-email', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
// authRouter.post('/reset-pwd', validateBody(doResetPasswordSchema), ctrlWrapper(doResetPasswordController));

export default authRouter;
