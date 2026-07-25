import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Periodicite } from '../../generated/prisma/enums';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextPaymentDate(date: string, periodicite: Periodicite): string {
  const next = new Date(date);
  if (periodicite === 'mensuel') {
    next.setMonth(next.getMonth() + 1);
  } else {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next.toISOString().slice(0, 10);
}

@Injectable()
export class ScheduledPaymentsService {
  private readonly logger = new Logger(ScheduledPaymentsService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processDuePayments() {
    const today = todayIso();

    const subscriptions = await this.prisma.subscription.findMany({
      where: { actif: true, prochainPaiement: today },
    });

    for (const subscription of subscriptions) {
      await this.prisma.transaction.create({
        data: {
          titre: subscription.nom,
          categorie: subscription.categorie,
          montant: subscription.montant,
          date: today,
          type: 'depense',
        },
      });

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          prochainPaiement: nextPaymentDate(subscription.prochainPaiement, subscription.periodicite),
        },
      });
    }

    const recurringPayments = await this.prisma.recurringPayment.findMany({
      where: { prochainPaiement: today },
    });

    for (const payment of recurringPayments) {
      await this.prisma.transaction.create({
        data: {
          titre: payment.nom,
          categorie: payment.categorie,
          montant: payment.montant,
          date: today,
          type: payment.type,
        },
      });

      await this.prisma.recurringPayment.update({
        where: { id: payment.id },
        data: {
          prochainPaiement: nextPaymentDate(payment.prochainPaiement, payment.periodicite),
        },
      });
    }

    if (subscriptions.length || recurringPayments.length) {
      this.logger.log(
        `Created ${subscriptions.length} subscription transaction(s) and ${recurringPayments.length} recurring payment transaction(s) for ${today}`,
      );
    }
  }
}
