import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecurringPaymentsService } from './recurring-payments.service';
import { CreateRecurringPaymentDto } from './dto/create-recurring-payment.dto';
import { UpdateRecurringPaymentDto } from './dto/update-recurring-payment.dto';

@Controller('recurring-payments')
export class RecurringPaymentsController {
  constructor(
    private readonly recurringPaymentsService: RecurringPaymentsService,
  ) {}

  @Post()
  create(@Body() createRecurringPaymentDto: CreateRecurringPaymentDto) {
    return this.recurringPaymentsService.create(createRecurringPaymentDto);
  }

  @Get()
  findAll() {
    return this.recurringPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringPaymentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecurringPaymentDto: UpdateRecurringPaymentDto,
  ) {
    return this.recurringPaymentsService.update(id, updateRecurringPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringPaymentsService.remove(id);
  }
}
