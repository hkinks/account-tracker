import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatement(): string {
    return "Hello World!";
  }
}
