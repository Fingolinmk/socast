import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SonosService } from './sonos.service';

@Controller('sonos')
export class SonosController {
  constructor(private readonly podcastService: SonosService) {}

  @Post('play')
  async play(@Body() body: { url: string }): Promise<string> {
    if (body.url !== '') {
      return this.podcastService.playPodcast(body.url);
    } else {
      return 'No Podcast URL Found';
    }
  }

  @Post('active_device')
  async set_device(@Body() body: { deviceID: string }): Promise<string> {
    this.podcastService.setActiveDevice(body.deviceID);
    return this.podcastService.getActiveDevice();
  }
  @Post('join_device')
  async join_device(@Body() body: { devices: string[] }): Promise<void> {
    const active_device = await this.podcastService.getActiveDevice();
    let devices = body.devices;

    if (devices[0] == active_device) {
    } else {
      await this.podcastService.setActiveDevice(devices[0]);
    }
    devices = body.devices.slice(1);

    devices.forEach((device) => {
      if (active_device != device) {
        console.log('joining: ', device);
        this.podcastService.joinDeviceWithActiveDevice(device);
      }
    });
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
