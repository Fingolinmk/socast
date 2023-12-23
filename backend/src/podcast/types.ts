
export interface PodcastDescription {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
}
export interface Subscription {
  id: number;
  url: string;
  title: string;
}

export interface podcastRssResponse {
  title: string;
  items: PodcastDescription[];
  image: string;
  description: string;
}
