const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

class AccountRepository {
  findByAccountId(accountId) {
    return usersDb.find(u => u.accountAlpha === accountId) || null;
  }

  updateBalance(accountId, newBalance) {
    const account = usersDb.find(u => u.accountAlpha === accountId);
    if (account) {
      account.balance = newBalance;
    }
  }

  getAll() {
    return usersDb;
  }
}

module.exports = new AccountRepository();
