import axios from "axios";
import { useEffect, useState } from "react";
import { PodcastDescription, SubscriptionDetail } from "./types";
import PodcastHero from "./app/episodeHero";
import { Button, List } from "antd";
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";

export default function PodcastList(index: number) {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const handlePlay = (item: PodcastDescription) => {
    const apiUrl = "http://localhost:3000/sonos/play";
    const res = axios.post(apiUrl, { url: item.url });
    console.log("Play res: ", res);
  };
  useEffect(() => {
    if (index > -1) {
      console.log("render PodcastList index:", index);
      const apiUrl = "http://localhost:3000/podcast/episodes/" + index;
      axios
        .get(apiUrl)
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
