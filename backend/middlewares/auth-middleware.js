import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    const error = new Error("JWT_SECRET is not set in backend/.env");
    error.statusCode = 500;
    throw error;
  }

  return secret;
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, getJwtSecret());
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
      }

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      return next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 401).json({
      message:
        error.statusCode === 500
          ? error.message
          : "Not authorized, invalid token",
    });
  }
};
