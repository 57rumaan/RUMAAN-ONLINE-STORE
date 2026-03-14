import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env["JWT_SECRET"] ?? "rumaan57-store-secret-key-2024";
const COOKIE_NAME = "rumaan_token";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env["NODE_ENV"] === "production",
};

function signToken(userId: number) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

function getUserFromToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { sub: number };
    return payload.sub;
  } catch {
    return null;
  }
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    }).returning({ id: users.id, name: users.name, email: users.email });

    const token = signToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = signToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ success: true });
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Not authenticated." });

    const userId = getUserFromToken(token);
    if (!userId) return res.status(401).json({ error: "Invalid session." });

    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user) return res.status(401).json({ error: "User not found." });
    return res.json({ user });
  } catch (err) {
    console.error("Auth me error:", err);
    return res.status(500).json({ error: "Failed to get user." });
  }
});

export default router;
