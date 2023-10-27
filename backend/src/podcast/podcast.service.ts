import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { parseString } from 'xml2js';

@Injectable()
export class PodcastService {
  private client: AxiosInstance;
  private sessionCookie: string = ''; // Initialize sessionCookie

  constructor() {
    this.client = axios.create();
  }

  xmlToJSON(xml: string): string {
    try {
      let result: string = '';  
      parseString(xml, (err, data) => {
        if (err) {
          result = "Error";
        } else {
          result = JSON.stringify(data, null, 2);
        }
      });
  
      return result;
    } catch (error) {
      return "Error";
    }
  }
  

  async login( username: string, password: string ) {
    try {
      const response = await this.client.post(
        `http://192.168.178.27:3005/api/2/auth/${username}/login.json`,
        null,
        {
          auth: {
            username: username,
            password: password,
          },
        },
      );

      if (response.status === 200) {
        const cookies = response.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          for (const cookie of cookies) {
            this.sessionCookie += cookie + '; ';

          }
        }
        console.log('Logged in successfully. Session cookie set.');
        console.log(this.sessionCookie)
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  async getDevices( username: string ) {
    try {
      const response = await this.client.get(
        `http://192.168.178.27:3005/api/2/devices/${username}.json`,
        {
          headers: {
            Cookie: this.sessionCookie, 
          },
        }
      );

      if (response.status === 200) {
        console.log('Devices:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to retrieve devices:', error);
    }
  }

  
  async getSubcriptions( username: string ): Promise<string> {
    try {
      const response = await this.client.get(
        `http://192.168.178.27:3005/subscriptions/${username}.json`,
        {
          headers: {
            Cookie: this.sessionCookie,
          },
        }
      );

      if (response.status === 200) {
        console.log('subscriptions:', response.data);
        return this.xmlToJSON(response.data);
      }
    } catch (error) {
      console.error('Failed to retrieve subscriptions:', error);
    }
  }
  async getStuff( username: string ) {
      try {
    const response = await this.client.get(
      `http://192.168.178.27:3005/api/2/episodes/${username}.json`,
      {
        headers: {
          Cookie: this.sessionCookie, 
        },
      }
    );

    if (response.status === 200) {
      console.log('Devices:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to retrieve episodes:', error);
  }
}

}
