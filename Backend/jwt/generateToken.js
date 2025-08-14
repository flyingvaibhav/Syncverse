import jwt from 'jsonwebtoken';

const createTokenAndSaveCookie = (res, userId) => {
  const token = jwt.sign({ userIid: userId.toString() }, process.env.JWT_TOKEN, { expiresIn: '5d' });// will expire in 5 days

  res.cookie("jwt", token, {
    httpOnly: true, // protects against XSS
    secure: process.env.NODE_ENV === 'production', // only in HTTPS in production
    sameSite: 'strict', // protects against CSRF
  });

  return token;
};

export default createTokenAndSaveCookie;
