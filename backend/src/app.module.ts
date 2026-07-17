import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [PrismaModule, TransactionsModule, SubscriptionsModule, RecurringPaymentsModule, SettingsModule, DashboardModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
