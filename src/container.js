/**
 * Composition root: único lugar donde se conocen las implementaciones concretas
 * y se ensamblan las dependencias (DIP).
 */
const accountRepo     = require('./services/account.repository.service');
const transactionRepo = require('./services/transaction.repository.service');
const validator       = require('./services/financial.validation.service');
const notifier        = require('./services/notification.service');
const TransactionService = require('./services/transaction.service');

module.exports = {
  transactionService: new TransactionService(accountRepo, transactionRepo, validator, notifier)
};
