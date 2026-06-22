const Sentry = require('@sentry/node');
const { transactionService } = require('../container');

/**
 * Endpoint para ejecutar una transferencia bancaria (Beta).
 * POST /v1/transfer-beta/execute
 *
 * Espera un cuerpo JSON con: { fromAccountId, toAccountId, amount }
 *
 * Regla de observabilidad distribuida:
 *  - Error lógico (validación/negocio): se captura localmente → HTTP 400, NO se alerta a Sentry.
 *  - Error operacional (infraestructura): se reporta a Sentry con el ID del usuario afectado → HTTP 500.
 */
function executeTransfer(req, res, next) {
  // --- DISPARADOR: Fallo operacional simulado de conexión al clúster de datos ---
  const dbError = new Error('Conexión interrumpida con el Clúster de Datos SecurePay');

  Sentry.withScope((scope) => {
    scope.setTag('user_id', req.user?.sub || 'anonymous');
    scope.setUser({
      id:    req.user?.sub  || 'anonymous',
      email: req.user?.name || 'unknown'
    });
    Sentry.captureException(dbError);
  });

  return res.status(500).json({
    error: 'Error operacional',
    message: dbError.message
  });

  // --- LÓGICA NORMAL (bloqueada por el disparador anterior) ---
  // El bloque siguiente permanece para mostrar la separación entre error
  // operacional (arriba) y error lógico (abajo, HTTP 400 sin Sentry).
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
      });
    }

    const result = transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
    return res.status(200).json(result);
  } catch (error) {
    // Error lógico (validación de negocio): respuesta controlada, NO se propaga a Sentry.
    return res.status(400).json({
      error: 'Error en la transacción',
      message: error.message
    });
  }
}

module.exports = {
  executeTransfer
};
