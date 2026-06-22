/**
 * Orquestador de transacciones.
 * Aplica DIP: no instancia ninguna dependencia internamente;
 * todas son inyectadas vía constructor desde el composition root (container.js).
 */
class TransactionService {
  constructor(accountRepo, transactionRepo, validator, notifier) {
    this.accountRepo = accountRepo;
    this.transactionRepo = transactionRepo;
    this.validator = validator;
    this.notifier = notifier;
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.accountRepo.findByAccountId(fromAccountId);
    this.validator.validateSenderExists(sender, fromAccountId);

    const receiver = this.accountRepo.findByAccountId(toAccountId);
    this.validator.validateReceiverExists(receiver, toAccountId);

    this.validator.validateAmount(amount);
    this.validator.validateSufficientFunds(sender, amount);

    this.accountRepo.updateBalance(fromAccountId, sender.balance - amount);
    this.accountRepo.updateBalance(toAccountId, receiver.balance + amount);

    const newTransaction = {
      transactionId: this.transactionRepo.generateId(),
      from: fromAccountId,
      to: toAccountId,
      amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    this.transactionRepo.save(newTransaction);

    const updatedSender = this.accountRepo.findByAccountId(fromAccountId);
    const updatedReceiver = this.accountRepo.findByAccountId(toAccountId);

    this.notifier.sendDebitNotification(sender.email, fromAccountId, amount, updatedSender.balance);
    this.notifier.sendCreditNotification(receiver.email, fromAccountId, amount, updatedReceiver.balance);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: updatedSender.balance
    };
  }

  getAccountBalance(accountId) {
    const account = this.accountRepo.findByAccountId(accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = TransactionService;
