import { Injectable } from '@nestjs/common';
import { SonosManager, SonosDevice } from '@svrooij/sonos';

@Injectable()
export class SonosService {
  private manager: SonosManager;
  private activeDevice: SonosDevice;
  constructor() {
    this.manager = new SonosManager();
    this.manager.InitializeWithDiscovery(10);
  }

  async playPodcast(url: string): Promise<string> {
    try {
      this.activeDevice.PlayNotification({ trackUri: url });
      return `Playing podcast from URL: ${url}`;
    } catch (error) {
      throw new Error(`Failed to play podcast: ${error.message}`);
    }
  }

  async getDevices(): Promise<
    { name: string; groupname: string; uuid: string }[]
  > {
    const sonosDevices = this.manager.Devices;

    const devicesInfo: { name: string; groupname: string; uuid: string }[] =
      sonosDevices.map((device) => ({
        name: device.Name,
        groupname: device.GroupName,
        uuid: device.Uuid,
      }));
    return devicesInfo;
  }
  async setActiveDevice(deviceID: string) {
    this.activeDevice = this.manager.Devices.find((i) => i.Uuid === deviceID);
  }
  async getActiveDevice(): Promise<string> {
    return this.activeDevice.Uuid;
  }
}
