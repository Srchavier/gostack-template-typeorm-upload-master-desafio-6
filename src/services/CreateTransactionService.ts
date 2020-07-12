import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transationRepository = getRepository(Transaction);

    const { total } = await getCustomRepository(
      TransactionsRepository,
    ).getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('transaction without a valid balance');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('sdasdasd');
    }

    let category = await categoryRepository.findOne({
      where: { title: category_title },
    });

    if (!category) {
      category = categoryRepository.create({ title: category_title });

      await categoryRepository.save(category);
    }

    const transation = transationRepository.create({
      title,
      type,
      value,
      category,
    });

    await transationRepository.save(transation);

    return transation;
  }
}

export default CreateTransactionService;
