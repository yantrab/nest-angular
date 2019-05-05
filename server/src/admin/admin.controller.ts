import { Controller, Get } from '@nestjs/common';

@Controller('rest/admin')
export class AdminController {
  @Get('/')
  getUsersData() {
    return [];
  }
}
