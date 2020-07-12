import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transations = await this.find();

    const { income, outcome } = transations.reduce(
      (balance, transation) => {
        switch (transation.type) {
          case 'income':
            // eslint-disable-next-line no-param-reassign
            balance.income += transation.value;
            break;
          case 'outcome':
            // eslint-disable-next-line no-param-reassign
            balance.outcome += transation.value;
            break;
          default:
            // eslint-disable-next-line no-param-reassign
            balance.total += transation.value;
            break;
        }
        return balance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
