import { IsNumber, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsNumber()
  soldeInitial!: number;

  @IsString()
  devise!: string;
}
