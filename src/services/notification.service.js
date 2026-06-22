class NotificationService {
  sendDebitNotification(email, accountId, amount, newBalance) {
    console.log(`\n--- [EMAIL OUTBOX] Enviando correo de confirmación ---`);
    console.log(`Para: ${email}`);
    console.log(`Asunto: Débito por Transferencia Realizada - Fintech SecurePay`);
    console.log(`Mensaje: Estimado usuario, se ha debitado de su cuenta ${accountId} el valor de $${amount}.`);
    console.log(`Su nuevo saldo disponible es: $${newBalance}.`);
    console.log(`------------------------------------------------------------\n`);
  }

  sendCreditNotification(email, fromAccountId, amount, newBalance) {
    console.log(`\n--- [EMAIL OUTBOX] Enviando correo de recepción ---`);
    console.log(`Para: ${email}`);
    console.log(`Asunto: Crédito por Transferencia Recibida - Fintech SecurePay`);
    console.log(`Mensaje: Estimado usuario, ha recibido una transferencia de $${amount} de la cuenta ${fromAccountId}.`);
    console.log(`Su nuevo saldo disponible es: $${newBalance}.`);
    console.log(`------------------------------------------------------------\n`);
  }
}

module.exports = new NotificationService();
