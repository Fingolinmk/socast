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
  private cache: Subscription[] = []; // TODO -> database
  private subscriptions: Subscription[] = []; // This is ugly (and will not work for multiple users)
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
      const results = await rssparser.parseURL(url);
      return results.title
    }
    catch (error) {
      console.error(`Error fetching or parsing XML for ${url}:`, error.message);
      return '~Could not find title~';
    }
  }
  async parseSubscriptions(subscription_urls: string[]): Promise<Subscription[]> {

    const return_me: Subscription[] = await Promise.all(
      subscription_urls.map(async (url, index) => {
        const elm_in_cache = this.cache.filter((cache) => cache.url === url);

        if (elm_in_cache.length < 1 || elm_in_cache[0].title === "~Could not find title~") {
          const title = await this.getTitleFrom(url)
          const new_elm: Subscription = { title: title, url: url, id: index };
          console.log("adding new element to cache: ", new_elm);
          this.cache.push(new_elm);

          return new_elm;
        } else {
          const elm = elm_in_cache[0];
          elm.id = index;

          return elm;
        }
      })
    );


    return return_me;
  }

  async getEpisodesByURL(url: string): Promise<podcastRssResponse> {
    try {
      const results = await rssparser.parseURL(url);
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
  }
  async getEpisodesByID(id: number): Promise<podcastRssResponse> {
    const findings = this.subscriptions.filter(
      (subscriptions) => subscriptions.id == id,
    );
    if (findings.length == 1) {
      return this.getEpisodesByURL(findings[0].url)
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
      const address = addresses.gpodder + `/api/2/devices/${username}.json`;
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
