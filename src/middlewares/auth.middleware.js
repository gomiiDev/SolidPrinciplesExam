const jwtService = require('../services/jwt.service');

/**
 * Middleware de autenticación para los microservicios Alpha y Beta.
 * Extrae el Bearer Token de la cabecera Authorization, lo verifica con la
 * clave pública (RS256) de forma autónoma y adjunta el payload a req.user.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token JWT ha expirado. Por favor, autentíquese nuevamente.'
      });
    }
    return res.status(403).json({
      error: 'Token inválido',
      message: 'El token JWT no es válido o su firma no pudo ser verificada.'
    });
  }
}

module.exports = authMiddleware;
