"use client";
import { useState, useEffect } from "react";
import { Select, Layout, Menu } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import type { MenuProps } from "antd/es/menu";
import { SonosDevice, Subscription } from "../../../types";
import axios from "axios";
import PodcastList from "@/podcastList";
import useAuthStore from "@/store/auth";
import useStore from "@/store/useStore";
type MenuItem = Required<MenuProps>["items"][number];

export default function Page() {
  const [devices, setDevices] = useState<SonosDevice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [episodeIndex, setEpisodeIndex] = useState<number>(-1);

  const { user, token } = useAuthStore();

  const items: MenuItem[] =
    subscriptions.length > 0
      ? subscriptions.map((subscription, index) => ({
        key: index,
        label: subscription.text,
      }))
      : [];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const index: number = +e.key;
    setEpisodeIndex(index);
  };

  const handleDeviceSelectionChange = (selected: string[]) => {
    const active_devices: string[] = selected.map((name) => {
      const device = devices.find((device) => device.name === name);
      return device ? device.uuid : "UUID not found";
    });
    const apiUrl = "http://localhost:3000/sonos/join_device";
    const res = axios.post(apiUrl, { devices: active_devices });
  };

  useEffect(() => {
    const apiUrl = "http://localhost:3000/podcast/subscriptions";

    const queryParams = {
      username: user,
      sessionToken: token,
    };

    console.log("querying with params: ", queryParams)
    axios.get(apiUrl, { params: queryParams })
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
    console.log("getting devices");
    const apiUrl = "http://localhost:3000/sonos/devices";
    axios
      .get(apiUrl).then((response: { status: number; data: any }) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((responseDevices: any) => {
        setDevices(responseDevices);
      })
      .catch((error: any) => {
        console.error("Error getting devices:", error);
      });
  }, []);

  return (
    <Layout style={{ padding: "10px 0" }}>
      <Sider style={{ width: 500 }} theme="light">
        <Menu items={items} onClick={onMenuClick} />
      </Sider>
      <Content style={{ padding: "0 10px" }}>
        {PodcastList(episodeIndex)}
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
