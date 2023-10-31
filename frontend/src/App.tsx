import { useState, useEffect } from "react";
import axios from "axios";
import { List, Button, Select, Layout, Menu } from "antd";
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./App.css";
import { Url } from "url";
import type { MenuProps } from "antd/es/menu";
type MenuItem = Required<MenuProps>["items"][number];

interface PodcastDescription {
  name: string;
  path: string;
}
interface SonosDevice {
  name: string;
  groupname: string;
  uuid: string;
}
interface subscriptions {
  text: string;
  type: string;
  url: Url;
}

function App() {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const [devices, setDevices] = useState<SonosDevice[]>([]);
  const [subscriptions, setSubscriptions] = useState<subscriptions[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState("0");
  const [subscriptionTitel, setCurrentSubscriptionTitel] = useState(" ");
  const items: MenuItem[] = subscriptions.map((subscription, index) => ({
    key: index,
    label: subscription.text,
    //icon: <MailOutlined />,
  }));
  const onMenuClick: MenuProps["onClick"] = (e) => {
    const index: number = +e.key;
    setCurrentSubscription(e.key);
    setCurrentSubscriptionTitel(subscriptions[index].text);
    //TODO: Hier korrekte episoden aus dem BE holen
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
    const res = axios.post(apiUrl, { url: item.path });
  };

  useEffect(() => {
    const apiUrl = "http://localhost:3000/podcast/episodes";
    axios
      .get(apiUrl)
      .then((response: { status: number; data: any }) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((responsepodcasts: any) => {
        setPodcasts(responsepodcasts);
      })
      .catch((error: any) => {
        console.error("Error fetching podcasts:", error);
      });
  }, []);

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
    <Layout>
      <Header className="my-header">
        <h1>SOCAST</h1>
      </Header>
      <Layout style={{ padding: "10px 0" }}>
        <Sider style={{ width: 500 }}>
          <Menu
            selectedKeys={[currentSubscription]}
            items={items}
            onClick={onMenuClick}
          ></Menu>
        </Sider>
        <Content style={{ padding: "0 10px" }}>
          <List
            size="large"
            header={
              <div>
                <h1>Podcast Episodes</h1>
                <h3>{subscriptionTitel}</h3>
              </div>
            }
            footer={<div>Footer</div>}
            bordered
            dataSource={podcasts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<CustomerServiceOutlined />}
                  title={item.name}
                  description={item.path}
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
      </Layout>
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

export default App;
