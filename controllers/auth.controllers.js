import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";
import {
  signupostRequestBodySchema,
  loginpostRequestBodySchema,
} from "../validations/request.validations.js";
import { hashedPasswordWithSalt } from "../utils/hashing.js";
import { getUserByEmail } from "../services/user.services.js";
import { createUserToken } from "../utils/token.js";

export const signup = async (req, res) => {
  const validationResult = await signupostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { firstname, lastname, email, password } = validationResult.data;

  //   checking if user is already exists or not

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });
  }
  // generating salt to hash the password

  const { salt, password: hashedPassword } = hashedPasswordWithSalt(password);

  const [user] = await db
    .insert(usersTable)
    .values({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });
  return res.status(201).json({ data: { userID: user.id } });
};

export const login = async (req, res) => {
  const validationResult = await loginpostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { email, password } = validationResult.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      error: `User with email ${email} does not exists, please register first!`,
    });
  }
  const { password: hashedPassword } = hashedPasswordWithSalt(
    password,
    user.salt
  );
  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: `Invalid Password ` });
  }
  const token = await createUserToken({ id: user.id });
  return res.json({ token });
};
