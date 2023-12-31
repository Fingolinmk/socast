import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SonosService } from './sonos.service';

@Controller('sonos')
export class SonosController {
  constructor(private readonly podcastService: SonosService) {}

  @Post('play')
  async play(@Body() body: { url: string }): Promise<string> {
    console.log(body)
    if (body.url !== "")
    {
      console.log("url from body")
      return this.podcastService.playPodcast(body.url)
    }
    else
    {
      return this.podcastService.playPodcast('https://download.deutschlandfunk.de/file/dradio/2023/09/27/der_tag_270923_dlf_20230927_1700_af1801b7.mp3')

    }     
  }

  @Post('active_device')
  async set_device(@Body() body: { deviceID: string }): Promise<string> {
    this.podcastService.setActiveDevice(body.deviceID);
    return this.podcastService.getActiveDevice();
  }
  @Post('join_device')
  async join_device(@Body() body: { devices: string[] }): Promise<void> {

    const active_device=await this.podcastService.getActiveDevice()
    let devices = body.devices;
    console.log("device[0], active device")
    console.log(devices[0])
    console.log(active_device)
    if (devices[0] == active_device){
      console.log("Active Device should not be changed")
    }
    else
    {
      console.log("SETTING ACTIVE DEVICE TO ", devices[0])
      await this.podcastService.setActiveDevice(devices[0]);
    }
    devices=body.devices.slice(1);

    devices.forEach(device =>
        {
          if(active_device != device){
            console.log("joining: ", device)
            this.podcastService.joinDeviceWithActiveDevice(device)
          }
          else
          {
            console.log("not joining with myself")
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
