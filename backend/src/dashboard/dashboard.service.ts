import { Injectable } from '@nestjs/common';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    const dashboardState = await this.prisma.dashboardState.findFirst();
    return dashboardState ?? { id: 'singleton', soldeBanque: 0 };
  }

  upsert(updateDashboardDto: UpdateDashboardDto) {
    const soldeBanque = updateDashboardDto?.soldeBanque ?? 0;
    return this.prisma.dashboardState.upsert({
      where: { id: 'singleton' },
      update: { soldeBanque },
      create: {
        id: 'singleton',
        soldeBanque,
      },
    });
  }
}
