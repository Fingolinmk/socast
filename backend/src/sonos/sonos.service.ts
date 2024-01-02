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
  padZero(num: number): string {
   return num < 10 ? `0${num}` : `${num}`;
 }
   formatPosition(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    return formattedTime;
  }
  
  async playPodcast(url: string, position?: number): Promise<string> {
    console.log("play podcast: url: ", url,"position: ", position)
    try {
      
      if (position){
        const form_pos=this.formatPosition(position)
        const add_uri_res= await this.activeDevice.AddUriToQueue(url,0,true)
        console.log(add_uri_res)
        const res=await this.activeDevice.SeekPosition(form_pos)
        this.activeDevice.Play()
      }
      else {
        this.activeDevice.PlayNotification({ trackUri: url });
      }
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
