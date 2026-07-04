import { IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  nom!: string;

  @IsString()
  categorie!: string;

  @IsNumber()
  montant!: number;

  @IsEnum(['mensuel', 'annuel'])
  periodicite!: 'mensuel' | 'annuel';

  @IsString()
  prochainPaiement!: string;

  @IsBoolean()
  actif!: boolean;
}
