import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

describe('AppController', () => {
  let appController: AppController;
  let mockHealthCheckService;
  let mockTypeOrmHealthIndicator;
  
  beforeEach(async () => {
    // Create mock implementations
    mockHealthCheckService = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        details: {
          database: {
            status: 'up'
          }
        }
      })
    };
    
    mockTypeOrmHealthIndicator = {
      pingCheck: jest.fn().mockResolvedValue({
        status: 'up'
      })
    };
    
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        // Use the actual class tokens but provide mock implementations
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockTypeOrmHealthIndicator
        }
      ],
    }).compile();
    
    appController = app.get<AppController>(AppController);
  });
  
  describe('health check', () => {
    it('should check database health', async () => {
      const result = await appController.check();
      
      expect(result.status).toBe('ok');
      expect(result.details.database.status).toBe('up');
      expect(mockHealthCheckService.check).toHaveBeenCalled();
      // expect(mockTypeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('database');
    });
  });
});