import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { podcastRssResponse, Subscription } from './types';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get('login') //TODO: should be POST
  async login() {
    //@Body() body: { username: string; password: string }
    this.podcastService.login('moritz', 'password');
  }

  @Get('devices')
  async getDevices() {
    //@Body() body: { username: string }
    return this.podcastService.getDevices('moritz');
  }
  @Get('subscriptions')
  async getSubscriptions() //@Body() body: { username: string }
  : Promise<Subscription[]> {
    console.log('get subscriptions for moritz');
    return this.podcastService.getSubcriptions('moritz');
  }
  @Get('episodes/:id')
  getEpisodes(@Param('id') id: number): Promise<podcastRssResponse> {
    const episodes = this.podcastService.getEpisodesByID(id);
    return episodes;
  }

  @Get('actions')
  getEpisodeActions(): any {
    const episodes = this.podcastService.getStuff('moritz');
    return episodes;
  }
}
