import { IsNumber } from 'class-validator';

export class CreateDashboardDto {
  @IsNumber()
  soldeBanque!: number;
}
