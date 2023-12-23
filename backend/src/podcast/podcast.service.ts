import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { addresses } from 'src/helpers';
import { parseString } from 'xml2js';
import { PodcastDescription, Subscription, podcastRssResponse } from './types';

const RssParser = require('rss-parser');
let rssparser = new RssParser();
@Injectable()
export class PodcastService {
  private client: AxiosInstance;
  //  private sessionCookie: string = '';
  private subscriptions: Subscription[] = [];
  constructor() {
    this.client = axios.create();
  }
  async parseXml(xmlContent) {
    return new Promise((resolve, reject) => {
      parseString(xmlContent, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  async getTitleFrom(url): Promise<string> {
    try {
      const response = await axios.get(url);
      const data = (await this.parseXml(response.data)) as any;
      console.log(data.rss.channel.title)
      return data.rss.channel.title;
    } catch (error) {
      console.error(`Error fetching or parsing XML for ${url}:`, error.message);
    }
  }
  async parseSubscriptions(subscriptions: string[]): Promise<Subscription[]> {
    this.subscriptions = await Promise.all(
      subscriptions.map(async (elm, index) => {
        return { text: await this.getTitleFrom(elm), url: elm, id: index };
      }),
    );
    return this.subscriptions;
  }

  async getEpisodesByID(id: number): Promise<podcastRssResponse> {
    const findings = this.subscriptions.filter(
      (subscriptions) => subscriptions.id == id,
    );
    if (findings.length == 1) {
      try {
        const results = await rssparser.parseURL(findings[0].url);
        const result_typed: podcastRssResponse = {
          title: results.title,
          image: results.image.url,
          items: results.items.map((itm) => ({
            name: itm.title,
            url: itm.enclosure.url || '',
            description: itm.contentSnippet || '',
          })) as PodcastDescription[],

          description: results.description,
        };
        return result_typed;
      } catch (error) {
        console.log('error in getEpisodebyID: ', error);
      }
    } else {
      console.log('multiple findings: ', findings);
    }
  }
  async login(username: string, password: string): Promise<{ token?: string }> {

    try {
      const address = `${addresses.gpodder}/api/2/auth/${username}/login.json`;
      const response = await this.client.post(address, null, {
        auth: {
          username: username,
          password: password,
        },
      });

      if (response.status === 200) {
        let sessionToken = ''
        const cookies = response.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          for (const cookie of cookies) {
            sessionToken += cookie + '; ';
          }
        }
        console.log('Logged in successfully. Session cookie set to: ', sessionToken);

        return { "token": sessionToken }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  async getDevices(username: string, sessionToken: string) {
    try {
      const address = addresses.gpodder + '/api/2/devices/${username}.json';
      const response = await this.client.get(address, {
        headers: {
          Cookie: sessionToken,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to retrieve devices:', error);
    }
  }

  async getSubcriptions(username: string, sessionToken: string): Promise<Subscription[]> {
    try {
      const address = addresses.gpodder + `/subscriptions/${username}.json`;
      const response = await this.client.get(address, {
        headers: {
          Cookie: sessionToken,
        },
      });

      if (response.status === 200) {
        console.log("got subscriptons: ", response.data)
        return this.parseSubscriptions(response.data);

      }
    } catch (error) {
      console.error('Failed to retrieve subscriptions:', error);
    }
  }
}
