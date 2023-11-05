import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastDescription, subscriptions } from './types';



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
  ): Promise<subscriptions[]> {
  return this.podcastService.getSubcriptions("moritz")
  }
  @Get('episodes/:id')
  getEpisodes(@Param('id') id: number ): PodcastDescription[] {
    this.podcastService.getEpisodesByID(id)
  return [
    { name: id +"Wie der Nahost-Krieg bis Deutschland wirkt", path: "https://podcast-mp3.dradio.de/podcast/2023/10/23/der_politikpodcast_folge_340_der_nahost_krieg_reicht_bis_dlf_20231023_1852_3c7542fb.mp3?refId=podcast-106" },
    { name: id + "Albtraum in Nahost", path: "https://podcast-mp3.dradio.de/podcast/2023/10/13/der_politikpodcast_folge_339_dlf_20231013_1940_4a21c0c8.mp3?refId=podcast-106" },
    { name: id +      "Nach den Landtagswahlen in Hessen & Bayern", path: "https://podcast-mp3.dradio.de/podcast/2023/10/09/der_politikpodcast_folge_337_nach_den_landtagswahlen_in_dlf_20231009_1900_2661127f.mp3?refId=podcast-106" },
    { name: id +"Einladung - Politikpodcast live in Dresden und Augsburg", path: "https://podcast-mp3.dradio.de/podcast/2023/10/06/der_politikpodcast_ankuendigung_livetour_dresden_und_dlf_20231006_1744_6aa68a40.mp3?refId=podcast-106" },
    { name: id +"Polen vor der Wahl", path: "https://podcast-mp3.dradio.de/podcast/2023/10/02/der_politikpodcast_folge_337_polen_vor_der_wahl_dlf_20231002_1724_a5fd12e6.mp3?refId=podcast-106" },

  ]
  }

}
