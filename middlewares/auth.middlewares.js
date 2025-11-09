import { validateUserToken } from "../utils/token.js";

export function authenticationMiddleware(req, res, next) {
  let token = req.cookies?.token;
  if (!token) {
    next();
  } else {
    const payload = validateUserToken(token);
    req.user = payload;
    next();
  }
}
export function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ error: "You must be loggedIn to access this resource!" });
  }
  next();
}
