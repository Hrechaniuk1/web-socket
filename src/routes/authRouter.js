// gen imports
import { Router } from "express";

// custom imports
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";


// server code
const router = Router();

router.post('/register', validateBody(), ctrlWrapper());
router.post('/login', validateBody(), ctrlWrapper());
router.post('/refresh', ctrlWrapper());
router.post('/logout', ctrlWrapper());
router.post('/send-reset-email', validateBody(), ctrlWrapper());
router.post('/reset-pwd', validateBody(), ctrlWrapper());

export default router;
