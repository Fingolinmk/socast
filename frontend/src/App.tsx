import { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Button,Select } from 'antd';
import { PlayCircleOutlined ,CustomerServiceOutlined ,} from '@ant-design/icons';
interface PodcastDescription {
  name: string;
  path: string;
}
interface SonosDevice {
  name: string;
  groupname:string;
  uuid: string;
}

function App() {
  const [podcasts, setPodcasts] = useState<PodcastDescription[]>([]);
  const [devices, setDevices] = useState<SonosDevice[]>([]);
  
  const handleDeviceSelectionChange = (selected: string[]) => {

    const active_devices: string[] = selected.map(name => {
      const device = devices.find(device => device.name === name);
      return device ? device.uuid : 'UUID not found'; 
  });
  const apiUrl = 'http://localhost:3000/sonos/join_device';
  const res=axios.post(apiUrl,{devices: active_devices});
  console.log(res)
  
  };
  const handlePlay = (item:PodcastDescription)=>
  {
    console.log("input", item.path)
    const apiUrl = 'http://localhost:3000/sonos/play';
    const res=axios.post(apiUrl,{ url: item.path });
    console.log(res)
  }
  useEffect(() => {
    const apiUrl = 'http://localhost:3000/podcast/episodes';
    axios.get(apiUrl)
      .then((response: { status: number; data: any; }) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data; 
      })
      .then((responsepodcasts:any) => {
        setPodcasts(responsepodcasts);
      })
      .catch((error:any) => {
        console.error('Error fetching podcasts:', error);
      });
  }, []); 


  useEffect(() => {
    const apiUrl = 'http://localhost:3000/sonos/devices';
    axios.get(apiUrl)
      .then((response: { status: number; data: any; }) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data; 
      })
      .then((responseDevices:any) => {
        setDevices(responseDevices);
        
      })
      .catch((error:any) => {
        console.error('Error fetching podcasts:', error);
      });
  }, []); 


  return (
    <div>

    <List
      size="large"
      header={<div><h1>Podcast Episodes</h1></div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={podcasts}
      renderItem={(item) =>
       <List.Item>
       <List.Item.Meta
       avatar= {<CustomerServiceOutlined />}
       title={item.name}
       description={item.path}
       />
        
      <div>
      <Button type="default" shape="circle" icon={<PlayCircleOutlined />} 
        onClick={() => handlePlay(item)} />
      </div>
              
       </List.Item>}
      />

  <Select
    mode="tags"
    style={{ width: '90%' }}
    onChange={handleDeviceSelectionChange} 
    tokenSeparators={[',']}
    options={devices.map(item => ({value : item.name, label: item.name }))}
  />

      </div>
  
  );
}

export default App;
