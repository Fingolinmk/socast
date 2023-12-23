import { Injectable } from '@nestjs/common';
import { SonosManager, SonosDevice } from '@svrooij/sonos';

@Injectable()
export class SonosService {
  private manager: SonosManager;
  private activeDevice: SonosDevice;
  private is_init = false;
  constructor() {
    try {
      const host = '192.168.178.43';

      this.manager = new SonosManager();
      this.manager
        .InitializeFromDevice(host)
        .then(console.log)
        .then(() => {
          this.manager.Devices.forEach((d) =>
            console.log(
              'Device %s (%s) is joined in %s',
              d.Name,
              d.Uuid,
              d.GroupName,
            ),
          );
        })
        .catch((error) => {
          console.log('something went wrong..:', error);
          this.is_init = false;
        });
      this.is_init = true;
    } catch (error) {
      console.log('something went wrong..:', error);
      this.is_init = false;
    }
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
    if (!this.is_init) {
      return [];
    }
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
  async joinDeviceWithActiveDevice(deviceID: string) {
    if (this.manager.Devices.find((i) => i.Uuid === deviceID)) {
      console.log(
        'sonos lib join %s with %s',
        this.activeDevice.Uuid,
        deviceID,
      );
      this.activeDevice.JoinGroup(
        this.manager.Devices.find((i) => i.Uuid === deviceID).Name,
      );
    } else {
      console.log('Device not found');
    }
  }
  async getActiveDevice(): Promise<string> {
    if (this.activeDevice) return this.activeDevice.Uuid;
    else return ''; // TODO CHECKME!
  }
}
