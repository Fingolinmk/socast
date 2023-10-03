import { Injectable } from '@nestjs/common';
import { Sonos, AsyncDeviceDiscovery } from 'sonos';

@Injectable()
export class SonosService {
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

  async getDevices(): Promise<string[]> {
    const discovery = new AsyncDeviceDiscovery();
    const sonosDevices = await discovery.discoverMultiple();
    const devices_ip: string[] = sonosDevices.map((device) => device.host);
    return devices_ip;
}
}