const { signToken } = require('../services/jwt.service');
const accountRepo   = require('../services/account.repository.service');

/**
 * POST /v1/auth/token
 * Body: { "accountId": "ACC-12345" }
 * Devuelve un JWT firmado con RS256 (expira en 2 minutos).
 */
function generateToken(req, res) {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({
      error: 'Petición incorrecta',
      message: 'El campo accountId es requerido en el cuerpo de la petición.'
    });
  }

  const account = accountRepo.findByAccountId(accountId);
  if (!account) {
    return res.status(404).json({
      error: 'Cuenta no encontrada',
      message: `La cuenta '${accountId}' no existe.`
    });
  }

  const token = signToken({ id: account.id, email: account.email });

  return res.status(200).json({
    token,
    tokenType: 'Bearer',
    expiresIn: 120,
    user: { id: account.id, email: account.email, accountId: account.accountAlpha }
  });
}

module.exports = { generateToken };
