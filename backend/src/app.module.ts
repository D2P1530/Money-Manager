import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, TransactionsModule, SubscriptionsModule, RecurringPaymentsModule, SettingsModule, DashboardModule],
})
export class AppModule {}
