import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { urlsTable } from "../models/url.models.js";
import { and, eq } from "drizzle-orm";

export const shortenUrl = async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetURL: url,
      userId: req.user.id,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });
  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
};

export const redirectOriginalURL = async (req, res) => {
  const shortCode = req.params.shortcode;
  console.log("shortcode", shortCode);

  const [result] = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode));
  if (!result) {
    return res.status(404).json({ error: `Invalid URL` });
  }
  return res.redirect(result.targetURL);
};

export const getAllShortenedURLs = async (req, res) => {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));
  return res.json({ codes });
};

export const deleteURL = async (req, res) => {
  const id = req.params.id;

  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id)), eq(urlsTable.userId, req.user.id));
  return res.status(200).json({ deleted: true });
};
