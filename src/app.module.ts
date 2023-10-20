import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SonosModule } from './sonos/sonos.module';
import { PodcastModule } from './podcast/podcast.module';

@Module({
  imports: [PodcastModule, SonosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
