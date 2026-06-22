class FinancialValidationService {
  validateSenderExists(sender, accountId) {
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${accountId}' no existe en la base de datos.`);
    }
  }

  validateReceiverExists(receiver, accountId) {
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${accountId}' no existe en la base de datos.`);
    }
  }

  validateAmount(amount) {
    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }
  }

  validateSufficientFunds(sender, amount) {
    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${sender.accountAlpha}' tiene $${sender.balance}, requiere $${amount}.`);
    }
  }
}

module.exports = new FinancialValidationService();
