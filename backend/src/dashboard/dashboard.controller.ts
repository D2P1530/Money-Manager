import { Controller, Get, Body, Patch } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findOne() {
    return this.dashboardService.findOne();
  }

  @Patch()
  upsert(@Body() updateDashboardDto: UpdateDashboardDto) {
    return this.dashboardService.upsert(updateDashboardDto);
  }
}
