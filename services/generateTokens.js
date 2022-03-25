const JWT = require('jsonwebtoken');
const httpErrors = require('http-errors');

function generateAccessToken(user) {
  return new Promise((resolve, reject) => {
    const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

    return JWT.sign(
      { user },
      JWT_SIGNATURE,
      {
        expiresIn: '30 days',
        issuer: process.env.ROOT_DOMAIN,
        audience: String(user.id),
      },
      (error, token) => {
        if (error) return reject(httpErrors.InternalServerError());
        return resolve(token);
      }
    );
  });
}

module.exports = { generateAccessToken };
