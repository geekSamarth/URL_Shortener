import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";
import {
  signupostRequestBodySchema,
  loginpostRequestBodySchema,
} from "../validations/request.validations.js";
import { hashedPasswordWithSalt } from "../utils/hashing.js";
import { getUserByEmail } from "../services/user.services.js";
import { createUserToken } from "../utils/token.js";
import { eq } from "drizzle-orm";

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
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    })
    .json({ message: "User loggedIn successfully!", success: true });
};

export const getUserDetails = async (req, res) => {
  const id = req.user.id;
  const user = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id));
  if (!user) {
    res.status(401).json({ error: `Error while logging out the user!` });
  }
  return res
    .status(200)
    .json({ message: "User details fetched successfully!", data: user });
};

export const logout = async (req, res) => {
  res.cookie("token", "", { expiresIn: new Date(0) });
  res.status(200).json({
    success: true,
    message: "User logged out successfully!",
  });
};
