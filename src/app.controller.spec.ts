import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should check database health', async () => {
      const mockHealthCheck = {
        check: jest.fn().mockResolvedValue({
          status: 'ok',
          details: {
            database: {
              status: 'up'
            }
          }
        })
      };

      const mockDb = {
        pingCheck: jest.fn()
      };

      appController['health'] = mockHealthCheck as any;
      appController['db'] = mockDb as any;

      const result = await appController.check();
      expect(result.status).toBe('ok');
      expect(result.details.database.status).toBe('up');
      expect(mockDb.pingCheck).toHaveBeenCalledWith('database');
    });
  });
});
