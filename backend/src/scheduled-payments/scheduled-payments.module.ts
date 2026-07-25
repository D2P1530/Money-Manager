import { Module } from '@nestjs/common';
import { ScheduledPaymentsService } from './scheduled-payments.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ScheduledPaymentsService],
})
export class ScheduledPaymentsModule {}
