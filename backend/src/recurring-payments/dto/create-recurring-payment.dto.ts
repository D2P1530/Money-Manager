import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateRecurringPaymentDto {
  @IsString()
  nom!: string;

  @IsString()
  categorie!: string;

  @IsNumber()
  montant!: number;

  @IsEnum(['depense', 'revenu'])
  type!: 'depense' | 'revenu';

  @IsEnum(['mensuel', 'annuel'])
  periodicite!: 'mensuel' | 'annuel';

  @IsString()
  prochainPaiement!: string;
}
