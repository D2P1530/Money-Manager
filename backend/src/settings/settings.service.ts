import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  findOne() {
    return this.prisma.settings.findFirst();
  }

  upsert(updateSettingDto: UpdateSettingDto) {
    const soldeInitial = updateSettingDto?.soldeInitial ?? 0;
    const devise = updateSettingDto?.devise ?? 'CHF';
    return this.prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { soldeInitial, devise },
      create: {
        id: 'singleton',
        soldeInitial,
        devise,
      },
    });
  }
}
