import jwt from "jsonwebtoken";

export const optionalAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
  } catch (error) {
    // Ignore invalid tokens for optional auth.
  }

  return next();
};
