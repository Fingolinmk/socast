import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

import { PodcastDescription, SubscriptionDetail } from "../../../../types";
import PodcastHero from "../../../../components/episodeHero";
import { Button, List } from "antd";
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import useAuthStore from "@/store/auth";

export default function PodcastList({ index, podcastUrl }: { index: number; podcastUrl: string }) {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [actionLoading, setactionLoading] = useState<Boolean>(false);
  const { user, token } = useAuthStore();
  const handlePlay = (item: PodcastDescription) => {
    const apiUrl = "http://localhost:3000/sonos/play";
    const res = axios.post(apiUrl, { url: item.url });
    console.log("Play res: ", res);
  };
  useEffect(() => {
    setactionLoading(false)
    if (index > -1) {
      const apiUrl = "http://localhost:3000/podcast/episodes/actions"
      console.log("requesting podcast actions for: ")
      console.log(podcastUrl)
      axios
        .get(apiUrl, { params: { url: podcastUrl, user: user, sessionToken: token } }) //TODO, obviously
        .then((response: { status: number; data: any }) => {
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
        .then((response: any) => {
          console.log(response)
        })
        .catch((error: any) => {
          console.error("Error fetching podcasts:", error);
        });
    }
    else { console.log("index", index) }
  }
    , [index]);


  useEffect(() => {
    setIsLoading(true)
    if (index > -1) {
      const apiUrl = "http://localhost:3000/podcast/episodes/byUrl/"
      axios
        .get(apiUrl, { params: { url: podcastUrl } })
        .then((response: { status: number; data: any }) => {
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
        .then((responsepodcasts: any) => {
          setPodcasts(responsepodcasts.items);
          setSelectedSubScription({
            id: index,
            url: "",
            title: responsepodcasts.title,
            description: responsepodcasts.description,
            image: responsepodcasts.image,
          });
        })
        .catch((error: any) => {
          console.error("Error fetching podcasts:", error);
        });
    }
    setIsLoading(false)
  }, [index]);
  const [selectedSubScription, setSelectedSubScription] =
    useState<SubscriptionDetail>({
      title: "",
      url: "",
      description: "",
      image: "",
      id: 0,
    });

  return (
    isLoading ? <Skeleton loading={true} active > </Skeleton> :
      <List
        size="large"
        header={PodcastHero(selectedSubScription)}
        footer={<div>Footer</div>}
        bordered
        dataSource={podcasts}
        renderItem={(item: PodcastDescription) => (
          <List.Item>
            <List.Item.Meta
              avatar={<CustomerServiceOutlined />}
              title={item.name}
              description={
                <Paragraph ellipsis={true}>{item.description}</Paragraph>
              }
            />
            <div>
              <Button
                type="default"
                shape="circle"
                icon={<PlayCircleOutlined />}
                onClick={() => handlePlay(item)}
              />
            </div>
          </List.Item>
        )}
      />
  );
}
