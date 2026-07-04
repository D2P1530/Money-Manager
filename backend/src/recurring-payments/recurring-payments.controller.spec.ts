import { Test, TestingModule } from '@nestjs/testing';
import { RecurringPaymentsController } from './recurring-payments.controller';
import { RecurringPaymentsService } from './recurring-payments.service';

describe('RecurringPaymentsController', () => {
  let controller: RecurringPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringPaymentsController],
      providers: [RecurringPaymentsService],
    }).compile();

    controller = module.get<RecurringPaymentsController>(RecurringPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
