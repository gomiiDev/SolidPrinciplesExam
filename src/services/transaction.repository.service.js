const transactionsHistory = [];

class TransactionRepository {
  generateId() {
    return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  save(record) {
    transactionsHistory.push(record);
    return record;
  }

  getAll() {
    return transactionsHistory;
  }
}

module.exports = new TransactionRepository();
