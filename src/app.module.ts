import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SonosModule } from './sonos/sonos.module';

@Module({
  imports: [SonosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
