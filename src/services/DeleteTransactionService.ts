// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRespository = getRepository(Transaction);

    const transation = transactionRespository.findOne({
      where: { id },
    });

    if (!transation) {
      throw new AppError('not exists transaction', 400);
    }

    await transactionRespository.delete(id);
  }
}

export default DeleteTransactionService;
