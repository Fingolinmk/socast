
export interface PodcastDescription {
  name: string;
  url: string;
  imageUrl: string;
  description: string;
}
export interface SonosDevice {
  name: string;
  groupname: string;
  uuid: string;
}
export interface Subscription {
  id: number;
  url: string;
  title: string;
}
export interface SubscriptionDetail extends Subscription {
  description: string;
  image: string;
}