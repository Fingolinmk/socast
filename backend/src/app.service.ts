import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World, This is a test of hot reload!yx';
  }
  getBye(): string {
    return 'bye';
  }
}
