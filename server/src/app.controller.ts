import { Controller, Get, Res } from '@nestjs/common';
import { resolve } from 'path';

@Controller()
export class AppController {
  @Get()
  root(@Res() response): void {
    response.sendFile(resolve('../dist/index.html'));
  }
}