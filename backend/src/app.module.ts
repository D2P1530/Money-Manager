import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [PrismaModule, TransactionsModule, SubscriptionsModule, RecurringPaymentsModule, SettingsModule],
})
export class AppModule {}
