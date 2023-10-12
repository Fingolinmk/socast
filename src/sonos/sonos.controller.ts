import { Controller, Post, Get, Body } from '@nestjs/common';
import { SonosService } from './sonos.service';

@Controller('sonos')
export class SonosController {
  constructor(private readonly podcastService: SonosService) {}

  @Post('play')
  async play(@Body() body: { url: string }): Promise<string> {
    //    const { url } = body;
    const url =
      'https://download.deutschlandfunk.de/file/dradio/2023/09/27/der_tag_270923_dlf_20230927_1700_af1801b7.mp3';
    return this.podcastService.playPodcast(url);
  }

  @Post('active_device')
  async set_device(@Body() body: { url: string }): Promise<string> {
    this.podcastService.setActiveDevice(body.url);
    return this.podcastService.getActiveDevice();
  }

  @Get('active_device')
  async get_device(): Promise<string> {
    return this.podcastService.getActiveDevice();
  }
  @Get('devices')
  async devices(): Promise<
    { name: string; groupname: string; uuid: string }[]
  > {
    return this.podcastService.getDevices();
  }
}
