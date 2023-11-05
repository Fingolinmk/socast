import { Url } from "url";

export interface PodcastDescription {
    name: string;
    path: string;
  }
export  interface subscriptions {
    name: string;
    type: string;
    url: Url;
    id: number
  }
  