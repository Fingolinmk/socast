import { Controller, Get, Post, Body } from '@nestjs/common';
import { PodcastService } from './podcast.service';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get('login') //TODO: should be POST
  async login(//@Body() body: { username: string; password: string }
  ) {

    this.podcastService.login("moritz","password")
  }

  @Get('devices')
  async getDevices(//@Body() body: { username: string }
  ) {
  return this.podcastService.getDevices("moritz")
  }
  @Get('subscriptions')
  async getSubscriptions(//@Body() body: { username: string }
  ): Promise<string> {
  return this.podcastService.getSubcriptions("moritz")
  }
  @Get('test')
  async getStuff(//@Body() body: { username: string }
  ) {
  return this.podcastService.getStuff("moritz")
  }
}
