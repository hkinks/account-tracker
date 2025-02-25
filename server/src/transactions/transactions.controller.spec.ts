import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactions = [
    {
      id: 1,
      date: new Date('2024-03-20'),
      description: 'Test transaction',
      amount: 100.00,
      currency: 'EUR',
      sender: 'John',
      receiver: 'Jane'
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{
        provide: TransactionsService,
        useValue: {
          getTransactions: jest.fn().mockResolvedValue(mockTransactions)
        }
      }],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should return list of transactions', async () => {
    const result = await controller.getTransactions();
    expect(result).toEqual(mockTransactions);
    expect(service.getTransactions).toHaveBeenCalled();
  });

  it('should return transactions with amount as float', async () => {
    const result = await controller.getTransactions();
    result.forEach(transaction => {
      expect(typeof transaction.amount).toBe('number');
    });
  });

  it('should return a single transaction by id', async () => {
    const result = await controller.getTransactionById(1);
    expect(result).toEqual(mockTransactions[0]);
    expect(service.getTransactionById).toHaveBeenCalledWith(1);
  });

  it('should create a new transaction', async () => {
    const newTransaction = {
      id: 2,
      date: new Date('2024-03-21'),
      description: 'New transaction',
      amount: 200.00,
      currency: 'EUR',
      sender: 'John',
      receiver: 'Jane'
    };
    const result = await controller.createTransaction(newTransaction);
    expect(result).toEqual(newTransaction);
    expect(service.createTransaction).toHaveBeenCalledWith(newTransaction);
  });

  it('should update a transaction', async () => {
    const updatedTransaction = {
      id: 1,
      date: new Date('2024-03-20'),
      description: 'Updated transaction',
      amount: 150.00,
      currency: 'EUR',
      sender: 'John',
      receiver: 'Jane'
    };
    const result = await controller.updateTransaction(1, updatedTransaction);
    expect(result).toEqual(updatedTransaction);
    expect(service.updateTransaction).toHaveBeenCalledWith(1, updatedTransaction);


  });

  it('should delete a transaction', async () => {
    await controller.deleteTransaction(1);
    expect(service.deleteTransaction).toHaveBeenCalledWith(1);
  });
  
});
