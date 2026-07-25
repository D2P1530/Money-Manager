import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduledPaymentsModule } from './scheduled-payments/scheduled-payments.module';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    TransactionsModule,
    SubscriptionsModule,
    RecurringPaymentsModule,
    SettingsModule,
    DashboardModule,
    ScheduledPaymentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
