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
    return this.prisma.settings.upsert({
      where: { id: 'singleton' },
      update: updateSettingDto,
      create: {
        id: 'singleton',
        soldeInitial: updateSettingDto.soldeInitial ?? 0,
        devise: updateSettingDto.devise ?? 'CHF',
      },
    });
  }
}
