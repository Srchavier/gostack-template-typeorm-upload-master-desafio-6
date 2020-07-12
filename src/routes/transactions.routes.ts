import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import updateConfig from '../config/updateConfig';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const update = multer(updateConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transationRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transationRepository.find();

  const balance = await transationRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransation = new CreateTransactionService();

  const transation = await createTransation.execute({
    title,
    value,
    type,
    category_title: category,
  });

  return response.json(transation);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepositoryDelete = new DeleteTransactionService();

  await transactionsRepositoryDelete.execute(id);

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  update.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(
      request.file.path,
    );

    return response.json(transactions);
  },
);

export default transactionsRouter;
