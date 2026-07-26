import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    const settings = await this.prisma.settings.findFirst();
    return settings ?? { id: 'singleton', soldeInitial: 0 };
  }

  upsert(updateSettingDto: UpdateSettingDto) {
    const soldeInitial = updateSettingDto?.soldeInitial ?? 0;
    return this.prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { soldeInitial },
      create: {
        id: 'singleton',
        soldeInitial,
      },
    });
  }
}
