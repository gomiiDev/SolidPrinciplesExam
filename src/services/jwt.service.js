const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Cargar claves una sola vez al iniciar el módulo
const privateKey = fs.readFileSync(path.join(__dirname, '../../private.pem'), 'utf8');
const publicKey  = fs.readFileSync(path.join(__dirname, '../../public.pem'),  'utf8');

/**
 * @param {Object} user - Objeto de usuario (debe tener id y email).
 * @returns {string} JWT firmado.
 */
function signToken(user) {
  const payload = {
    sub:  user.id    || user.sub,
    name: user.email || user.name,
    exp:  Math.floor(Date.now() / 1000) + 120  // expira en 2 minutos
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Verifica un JWT usando únicamente la clave pública (RS256).
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado si la firma es válida y el token no expiró.
 */
function verifyToken(token) {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

module.exports = {
  signToken,
  verifyToken
};
