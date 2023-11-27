import { Url } from "url";

export interface PodcastDescription {
    name: string;
    url: string;
    imageUrl: string;
    description: string;
  }
export interface Subscriptions {
    name: string;
    url: Url;
    id: number
  }
  
  export interface podcastRssResponse {
    title: string;
    items: PodcastDescription[];
    image: string;
    description: string
  }