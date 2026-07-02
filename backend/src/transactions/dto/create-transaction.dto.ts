import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  titre!: string;

  @IsString()
  categorie!: string;

  @IsNumber()
  montant!: number;

  @IsString()
  date!: string;

  @IsEnum(['depense', 'revenu'])
  type!: 'depense' | 'revenu';

  @IsString()
  @IsOptional()
  description?: string;
}
