import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringPaymentDto } from './dto/create-recurring-payment.dto';
import { UpdateRecurringPaymentDto } from './dto/update-recurring-payment.dto';

@Injectable()
export class RecurringPaymentsService {
  constructor(private prisma: PrismaService) {}

  create(createRecurringPaymentDto: CreateRecurringPaymentDto) {
    return this.prisma.recurringPayment.create({
      data: createRecurringPaymentDto,
    });
  }

  findAll() {
    return this.prisma.recurringPayment.findMany({
      orderBy: { prochainPaiement: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.recurringPayment.findUnique({
      where: { id },
    });
  }

  update(id: string, updateRecurringPaymentDto: UpdateRecurringPaymentDto) {
    return this.prisma.recurringPayment.update({
      where: { id },
      data: updateRecurringPaymentDto,
    });
  }

  remove(id: string) {
    return this.prisma.recurringPayment.delete({
      where: { id },
    });
  }
}
