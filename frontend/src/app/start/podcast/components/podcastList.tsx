import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";

import { PodcastDescription, SubscriptionDetail } from "../../../../types";
import PodcastHero from "../../../../components/episodeHero";
import { Button, List } from "antd";
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";

export default function PodcastList({ index, podcastUrl }: { index: number; podcastUrl: string }) {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const handlePlay = (item: PodcastDescription) => {
    const apiUrl = "http://localhost:3000/sonos/play";
    const res = axios.post(apiUrl, { url: item.url });
    console.log("Play res: ", res);
  };
  useEffect(() => {
    setIsLoading(true)
    console.log("loading...")
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
            text: responsepodcasts.title,
            description: responsepodcasts.description,
            image: responsepodcasts.image,
          });
        })
        .catch((error: any) => {
          console.error("Error fetching podcasts:", error);
        });
    }
    console.log("loading done")
    setIsLoading(false)
  }, [index]);
  const [selectedSubScription, setSelectedSubScription] =
    useState<SubscriptionDetail>({
      text: "",
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
