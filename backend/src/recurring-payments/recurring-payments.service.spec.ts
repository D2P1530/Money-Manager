import { Test, TestingModule } from '@nestjs/testing';
import { RecurringPaymentsService } from './recurring-payments.service';

describe('RecurringPaymentsService', () => {
  let service: RecurringPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringPaymentsService],
    }).compile();

    service = module.get<RecurringPaymentsService>(RecurringPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
