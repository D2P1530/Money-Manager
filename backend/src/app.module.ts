import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [PrismaModule, TransactionsModule, SubscriptionsModule],
})
export class AppModule {}
