// custo imports
import { THIRTY_DAYS } from "../constants/authConstants.js";
import { doResetPassword, loginUser, logoutUser, refreshUser, registerUser, resetPassword } from "../services/auth.js";


// support code
function setupSession (res, session) {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
};


// server code
export const registerController = async (req, res) => {
    const user = await registerUser(req.body);
    // const userData = user.toJSON();

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        // data: userData,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);
    setupSession(res, session);
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {accessToken: session.accessToken},

    });
};

export const refreshUserController = async (req, res) => {
    const session = await refreshUser(req.cookies.sessionId, req.cookies.refreshToken);
    setupSession(res, session);
    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {accessToken: session.accessToken},
    });
};

export const logoutUserController = async (req, res) => {
    if(req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    };
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();

};

export const resetPasswordController = async (req, res) => {
        await resetPassword(req.body.email);
        res.status(200).json({
            status: 200,
            message: 'Reset password email was successfully sent!',
            data: {},
        });

};

export const doResetPasswordController = async (req, res) => {
    await doResetPassword(req.body);
    res.status(200).json({
        status: 200,
        message: "Password has been successfully reset.",
        data: {}
    });
};
