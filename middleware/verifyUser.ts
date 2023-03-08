import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

function verify(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Access denied.");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
}

export default verify;
