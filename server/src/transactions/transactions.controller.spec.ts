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
});
