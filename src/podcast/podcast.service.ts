import { Injectable } from '@nestjs/common';
import { Sonos, DeviceDiscovery } from 'sonos';

@Injectable()
export class PodcastService {
  private readonly sonos: Sonos;

  constructor() {
    this.sonos = new Sonos('192.168.178.53');
  }

  async playPodcast(url: string): Promise<string> {
    try {
      await this.sonos.play(url);

      return `Playing podcast from URL: ${url}`;
    } catch (error) {
      throw new Error(`Failed to play podcast: ${error.message}`);
    }
  }

  async getDevices(): Promise<[string]> {
    const discovery = new DeviceDiscovery();
    await discovery.discover().then((device, model) => {
      return device + model;
    });
  }
}
