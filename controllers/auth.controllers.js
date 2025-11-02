import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";
import { signupostRequestBodySchema } from "../validations/request.validations.js";
import { hashedPasswordWithSalt } from "../utils/hashing.js";
import { getUserByEmail } from "../services/user.services.js";

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
