import { Module } from '@nestjs/common';
import { SonosController } from './sonos.controller';
import { SonosService } from './sonos.service';

@Module({
  controllers: [SonosController],
  providers: [SonosService],
})
export class SonosModule {}
