import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { parseString } from 'xml2js';
import { PodcastDescription, Subscription, podcastRssResponse } from './types';

const RssParser = require('rss-parser');
let rssparser = new RssParser();
@Injectable()
export class PodcastService {
  private client: AxiosInstance;
  private sessionCookie: string = '';
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
      const xmlContent = response.data;
      const data = (await this.parseXml(xmlContent)) as any;
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
    console.log('getEpisodesByID');
    const findings = this.subscriptions.filter(
      (subscriptions) => subscriptions.id == id,
    );
    if (findings.length == 1) {
      try {
        const results = await rssparser.parseURL(findings[0].url);
        for (const i in results) {
          console.log(i);
        }

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
      console.log('findings: ', findings);
    }
  }
  async login(username: string, password: string) {
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
        console.log(this.sessionCookie);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  async getDevices(username: string) {
    try {
      const response = await this.client.get(
        `http://192.168.178.27:3005/api/2/devices/${username}.json`,
        {
          headers: {
            Cookie: this.sessionCookie,
          },
        },
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to retrieve devices:', error);
    }
  }

  async getSubcriptions(username: string): Promise<Subscription[]> {
    try {
      const response = await this.client.get(
        `http://192.168.178.27:3005/subscriptions/${username}.json`,
        {
          headers: {
            Cookie: this.sessionCookie,
          },
        },
      );

      if (response.status === 200) {
        return this.parseSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Failed to retrieve subscriptions:', error);
    }
  }
  async getStuff(username: string) {
    // TEST FUNCTION
    try {
      //`http://192.168.178.27:3005/api/2/episodes/${username}.json`
      const url = 'http://192.168.178.27:3005/api/2/episodes/moritz.json';
      const response = await this.client.get(url, {
        headers: {
          Cookie: this.sessionCookie,
        },
        data: { podcast: 'https://ukw.fm/feed/mp3/' },
      });

      if (response.status === 200) {
        console.log(response);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to retrieve episodes:', error);
    }
  }
}
