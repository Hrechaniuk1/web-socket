// general imports
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

// custom imports
import { usersCollection } from "../db/models/user.js";
import {FIFTEEN_MINUTES, THIRTY_DAYS}  from '../constants/authConstants.js';
import {sessionCollection} from '../db/models/session.js';
import {sendMail} from '../helpers/sendMail.js';
import { env } from '../helpers/env.js';
import { TEMPLETE_HTML } from '../constants/htmlTemplete.js';


// support code
async function createSession(userId) {
    const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};


// server code
export const registerUser = async (data) => {
    const user = await usersCollection.findOne({email: data.email});
    if(user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(data.password, 10);
    return await usersCollection.create({...data, password: encryptedPassword});
};

export const loginUser = async (data) => {
    const user = await usersCollection.findOne({email: data.email});
    if(!user) throw createHttpError(404, 'User not found');
    const ifPasswordsEqual = await bcrypt.compare(data.password, user.password);
    if(!ifPasswordsEqual) throw createHttpError(401, 'Unauthorized');

    await sessionCollection.deleteOne({userId: user._id});
    const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

};

export const refreshUser = async (sessionId, refreshToken) => {
    const session = await sessionCollection.findOne({_id: sessionId, refreshToken});
    if(!session) throw createHttpError(401, 'Session not found');

    const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if(isExpired) throw createHttpError(401, 'Session token expired');
    await sessionCollection.deleteOne({_id: sessionId, refreshToken});
    const newSession = createSession(session.userId);
    return newSession;

};

export const logoutUser = (sessionId) => sessionCollection.deleteOne({_id: sessionId});

export const resetPassword = async (email) => {
  const user = await usersCollection.findOne({email: email});
  if(!user) {
    throw createHttpError(404, 'User not found');
  };

  const resetToken = jwt.sign(
    {
    sub: user._id,
    email,
  },
  env('JWT_SECRET'),
  {
    expiresIn: '15m',
  },
);

const resetUrl = `http://${env('APP_DOMAIN')}/reset-password?token=${resetToken}`;

const resetPasswordTemplatePath = path.join(TEMPLETE_HTML, 'reset-password-email.html');
const templateSourse = ( await fs.readFile(resetPasswordTemplatePath)).toString();


const templete = handlebars.compile(templateSourse);
const html = templete({
  name: user.name,
  link: resetUrl,
});

console.log(html);
try {
  await sendMail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
} catch {
  throw createHttpError("Failed to send the email, please try again later.");
};
};

export const doResetPassword = async (data) => {
  let entries;

  try {
    entries = jwt.verify(data.token, env('JWT_SECRET'));
  } catch (err) {
    if(err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  };

  const user = await usersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if(!user) {
    throw createHttpError(404, 'User not found');
  };

  const session = await sessionCollection.findOne({userId: user._id});
  if(session) await sessionCollection.deleteOne({userId: user._id});

  const encruptedPassword = await bcrypt.hash(data.password, 10);

  await usersCollection.updateOne({
    _id: user._id},
    {password: encruptedPassword});
};
