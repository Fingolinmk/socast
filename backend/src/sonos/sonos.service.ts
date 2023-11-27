import { Injectable } from '@nestjs/common';
import { SonosManager, SonosDevice } from '@svrooij/sonos';

@Injectable()
export class SonosService {
  private manager: SonosManager;
  private activeDevice: SonosDevice;
  constructor() {
    this.manager = new SonosManager();
    this.manager.InitializeFromDevice("192.168.178.43")
    .then(console.log)
    .then(() => {
      this.manager.Devices.forEach(d => console.log('Device %s (%s) is joined in %s', d.Name,d.Uuid,  d.GroupName))
    })
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
  async joinDeviceWithActiveDevice(deviceID: string) {
    if (this.manager.Devices.find((i) => i.Uuid === deviceID))
    {
      console.log("sonos lib join %s with %s", this.activeDevice.Uuid, deviceID)      
      this.activeDevice.JoinGroup(this.manager.Devices.find((i) => i.Uuid === deviceID).Name);
    }
    else 
    {
      console.log("Device not found")
    }
  }
  async getActiveDevice(): Promise<string> {
    
    if (this.activeDevice)
    return this.activeDevice.Uuid;
    else 
    return "" // TODO CHECKME!
  }
}
//socast-backend-1          | Device Küche (RINCON_38420B934AAC01400) is joined in Küche
//socast-backend-1          | Device Büro (RINCON_7828CAD174E001400) is joined in Büro
//socast-backend-1          | Device Esszimmer (RINCON_38420B9388F601400) is joined in Esszimmer
//socast-backend-1          | Device Hauptschlafzimmer (RINCON_F0F6C12EF90401400) is joined in Hauptschlafzimmer



//socast-backend-1          | Device Küche (RINCON_38420B934AAC01400) is joined in Küche
//socast-backend-1          | Device Büro (RINCON_7828CAD174E001400) is joined in Büro
//socast-backend-1          | Device Esszimmer (RINCON_38420B9388F601400) is joined in Esszimmer
//socast-backend-1          | Device Hauptschlafzimmer (RINCON_F0F6C12EF90401400) is joined in Hauptschlafzimmer
//socast-backend-1          | Device Sonos Roam SL (RINCON_F0F6C13DD3CE01400) is joined in Sonos Roam SL