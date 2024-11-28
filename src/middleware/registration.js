// gen imports
import {HttpError} from 'http-errors';

// custom imports
import { RegistrationCodeCollection } from "../db/models/codes";

export const registration = async (req, res, next) => {

try {
    const isAuthorized = await RegistrationCodeCollection.find(req.body.code)
    if (isAuthorized) {
        next();
      } else {
        return next(new HttpError(400, 'Invalid registration code'));
      }
} catch (err) {
    return next(new HttpError(500, 'Internal server error'));
}

}
