import { IsNumber } from 'class-validator';

export class CreateSettingDto {
  @IsNumber()
  soldeInitial!: number;
}
