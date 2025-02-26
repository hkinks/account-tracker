import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceRecordsService } from './balance-records.service';
import { BalanceRecord } from './balance-records.entity';

describe('BalanceRecordsService', () => {
  let service: BalanceRecordsService;
  let repository: Repository<BalanceRecord>;

  const mockBalanceRecords = [
    {
      id: '1',
      accountId: 'acc1',
      balance: 100.5,
      recordedAt: new Date(),
      account: { id: 'acc1', name: 'Test Account 1' },
    },
    {
      id: '2',
      accountId: 'acc1',
      balance: 200.75,
      recordedAt: new Date(),
      account: { id: 'acc1', name: 'Test Account 1' },
    },
    {
      id: '3',
      accountId: 'acc2',
      balance: 300.25,
      recordedAt: new Date(),
      account: { id: 'acc2', name: 'Test Account 2' },
    },
  ];

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceRecordsService,
        {
          provide: getRepositoryToken(BalanceRecord),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BalanceRecordsService>(BalanceRecordsService);
    repository = module.get<Repository<BalanceRecord>>(
      getRepositoryToken(BalanceRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all balance records', async () => {
      mockRepository.find.mockResolvedValue(mockBalanceRecords);

      const result = await service.findAll();

      expect(result).toEqual(mockBalanceRecords);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['account'],
      });
    });

    it('should ensure all returned balances are numeric', async () => {
      mockRepository.find.mockResolvedValue(mockBalanceRecords);

      const result = await service.findAll();

      result.forEach((record) => {
        expect(typeof record.balance).toBe('number');
        expect(isNaN(record.balance)).toBe(false);
      });
    });
  });

  describe('findByAccountId', () => {
    it('should return balance records for a specific account', async () => {
      const accountId = 'acc1';
      const filteredRecords = mockBalanceRecords.filter(
        (record) => record.accountId === accountId,
      );
      mockRepository.find.mockResolvedValue(filteredRecords);

      const result = await service.findByAccountId(accountId);

      expect(result).toEqual(filteredRecords);
      expect(repository.find).toHaveBeenCalledWith({
        where: { accountId },
        relations: ['account'],
        order: { recordedAt: 'DESC' },
      });
    });

    it('should ensure all returned balances for an account are numeric', async () => {
      const accountId = 'acc1';
      const filteredRecords = mockBalanceRecords.filter(
        (record) => record.accountId === accountId,
      );
      mockRepository.find.mockResolvedValue(filteredRecords);

      const result = await service.findByAccountId(accountId);

      result.forEach((record) => {
        expect(typeof record.balance).toBe('number');
        expect(isNaN(record.balance)).toBe(false);
      });
    });
  });

  describe('findOne', () => {
    it('should return a single balance record by id', async () => {
      const recordId = '1';
      const record = mockBalanceRecords.find((r) => r.id === recordId);
      mockRepository.findOne.mockResolvedValue(record);

      const result = await service.findOne(recordId);

      expect(result).toEqual(record);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: recordId },
        relations: ['account'],
      });
    });

    it('should ensure the returned balance is numeric', async () => {
      const recordId = '1';
      const record = mockBalanceRecords.find((r) => r.id === recordId);
      mockRepository.findOne.mockResolvedValue(record);

      const result = await service.findOne(recordId);

      expect(typeof result.balance).toBe('number');
      expect(isNaN(result.balance)).toBe(false);
    });
  });
});
