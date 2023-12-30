import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { addresses } from 'src/helpers';
import { parseString } from 'xml2js';
import { PodcastDescription, Subscription, podcastRssResponse } from './types';

const RssParser = require('rss-parser');
let rssparser = new RssParser({ timeout: 35000 });
@Injectable()
export class PodcastService {
  private client: AxiosInstance;
  private cache: Subscription[] = [];
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
      return 'undefined';
    }
  }
  async parseSubscriptions(subscription_urls: string[]): Promise<Subscription[]> {

    const return_me: Subscription[] = await Promise.all(
      subscription_urls.map(async (url, index) => {
        const elm_in_cache = this.cache.filter((cache) => cache.url === url);

        if (elm_in_cache.length < 1 || elm_in_cache[0].title === "undefined") {
          const title = await this.getTitleFrom(url)
          const new_elm: Subscription = { title: title, url: url, id: index };
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
  async getEpisodeActions(username: string, url: string, sessionToken: string): Promise<any> {
    console.log("Get episode actions, token; ", sessionToken, "user: ", username, "podcastURL", url)
    try {
      const address = addresses.gpodder + `/api/2/episodes/${username}.json`;
      const response = await this.client.get(address, {
        headers: {
          Cookie: sessionToken,
        },
        params: {
          podcast: url,
          aggregated: false
        }
      });

      if (response.status === 200) {
      //  console.log("action answer: ", response.data)
      //const result=response.data.actions

        const result = response.data.actions.filter((elm) => elm.podcast == url);
        console.log(result)  
        console.log("url: ", url)
        return result;
      }
    } catch (error) {
      console.error('Failed to retrieve devices:', error);
    }
  }
  async getEpisodesByURL(url: string): Promise<podcastRssResponse> {
    try {
      const results = await rssparser.parseURL(url);
      const result_typed: podcastRssResponse = {
        title: results.title,
        image: results.image.url,
        url: url,
        items: results.items.map((itm) => ({
          name: itm.title,
          url: itm.enclosure.url || '',
          description: itm.contentSnippet || '',
        })) as PodcastDescription[],

        description: results.description,
      };
      return result_typed;
    } catch (error) {
      console.log('error in getEpisodebyURL: ', error);
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
