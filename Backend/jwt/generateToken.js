import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  if (!process.env.JWT_TOKEN) throw new Error("JWT_TOKEN not set");
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_TOKEN, { expiresIn: "10d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createTokenAndSaveCookie;