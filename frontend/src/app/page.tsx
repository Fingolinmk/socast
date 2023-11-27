"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { List, Button, Select, Layout, Menu } from "antd";
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./globals.css";
import type { MenuProps } from "antd/es/menu";
import {
  PodcastDescription,
  SonosDevice,
  SubscriptionDetail,
  Subscription,
} from "../types";
import Paragraph from "antd/es/typography/Paragraph";
import PodcastHero from "./episodeHero";
type MenuItem = Required<MenuProps>["items"][number];

export default function App() {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const [devices, setDevices] = useState<SonosDevice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubScription, setSelectedSubScription] =
    useState<SubscriptionDetail>({
      text: "",
      url: "",
      description: "",
      image: "",
      id: 0,
    });

  const items: MenuItem[] =
    subscriptions.length > 0
      ? subscriptions.map((subscription, index) => ({
          key: index,
          label: subscription.text,
        }))
      : [];

  const setEpisodes = (index: number) => {
    const apiUrl =
      "http://localhost:3000/podcast/episodes/" + selectedSubScription.id;
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
  };
  const onMenuClick: MenuProps["onClick"] = (e) => {
    const index: number = +e.key;
    setEpisodes(index);
  };

  const handleDeviceSelectionChange = (selected: string[]) => {
    const active_devices: string[] = selected.map((name) => {
      const device = devices.find((device) => device.name === name);
      return device ? device.uuid : "UUID not found";
    });
    const apiUrl = "http://localhost:3000/sonos/join_device";
    const res = axios.post(apiUrl, { devices: active_devices });
  };
  const handlePlay = (item: PodcastDescription) => {
    const apiUrl = "http://localhost:3000/sonos/play";
    console.log("play: ", item.url);
    const res = axios.post(apiUrl, { url: item.url });
  };

  useEffect(() => {
    const apiUrl = "http://localhost:3000/podcast/subscriptions";
    axios
      .get(apiUrl)
      .then((response: { status: number; data: any }) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((responsepodcasts: any) => {
        console.log("response: ", responsepodcasts);
        setSubscriptions(responsepodcasts);
      })
      .catch((error: any) => {
        console.error("Error fetching subscriptions:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = "http://localhost:3000/sonos/devices";
    axios
      .get(apiUrl)
      .then((response: { status: number; data: any }) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((responseDevices: any) => {
        setDevices(responseDevices);
      })
      .catch((error: any) => {
        console.error("Error fetching podcasts:", error);
      });
  }, []);

  return (
    <Layout style={{ padding: "10px 0" }}>
      <Sider style={{ width: 500 }} theme="light">
        <Menu items={items} onClick={onMenuClick} />
      </Sider>
      <Content style={{ padding: "0 10px" }}>
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
      </Content>

      <Footer
        style={{
          borderTop: "1px solid #e8e8e8",
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Select
          mode="tags"
          style={{ width: "100%" }}
          onChange={handleDeviceSelectionChange}
          tokenSeparators={[","]}
          options={devices.map((item) => ({
            value: item.name,
            label: item.name,
          }))}
        />
      </Footer>
    </Layout>
  );
}
