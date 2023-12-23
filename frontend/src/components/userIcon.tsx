"use client";
import useAuthStore from "@/store/auth";

import { UserOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";

const UserIcon: React.FC = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const onIconClick = () => {
    console.log("navigate to user");
    router.push("/user");
  };

  return (
    <div>
      <Tooltip placement="top" title={user}>
        <Button>
          <UserOutlined onClick={onIconClick}></UserOutlined>
        </Button>
      </Tooltip>
    </div>
  );
};
export default UserIcon;
