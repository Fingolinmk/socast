import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { podcastRssResponse, Subscription } from './types';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) { }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.podcastService.login(body.username, body.password);
  }

  @Get('devices')
  async getDevices(@Body() body: { username: string, sessionToken: string }) {
    return this.podcastService.getDevices(body.username, body.sessionToken);
  }
  @Get('subscriptions')
  async getSubscriptions(@Query('username') username: string,
    @Query('sessionToken') sessionToken: string,)
    : Promise<Subscription[]> {
    return this.podcastService.getSubcriptions(username, sessionToken);
  }
  @Get('episodes/byUrl')
  getEpisodesByUrl(@Query('url') url: string): Promise<podcastRssResponse> {
    console.log("GET EPISODES BY URL!", url)
    const episodes = this.podcastService.getEpisodesByURL(url);
    return episodes;
  }

  @Get('episodes/actions')
  async getEpisodeActions(@Query('url') url: string, @Query('user') user: string, @Query('sessionToken') sessionToken: string): Promise<String> {
    const actions = await this.podcastService.getEpisodeActions(user, url, sessionToken)
    //console.log(actions)
    return actions
  }

}
