"use client";
import useAuthStore from "@/store/auth";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, Button, Col, Form, Input, Row, Space } from "antd";
import Title from "antd/es/typography/Title";
import useStore from "@/store/useStore";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser, user, clearUser, setToken, clearToken } =
    useAuthStore();
  const token = useStore(useAuthStore, (state) => state.token)

  const router = useRouter();
  const login = async (user: string, passw: string) => {
    setLoading(true);

    try {
      const endpoint = "http://localhost:3000/podcast/login";
      console.log("trying to login at: ", endpoint);

      interface ApiResponse {
        sessionToken: string;
      }

      interface RequestData {
        username: string;
        password: string;
      }

      const requestData: RequestData = {
        username: user,
        password: passw,
      };

      axios
        .post<ApiResponse>(endpoint, requestData)
        .then((response: { data: { token: string; }; }) => {
          setToken(response.data.token);
          setUser(user);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("failure at login ", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setError("");
    clearToken();
    clearUser();
  };

  const back = () => {
    router.back();
  };

  const onFinish = (values: FieldType) => {
    if (values.user && values.password) {
      login(values.user, values.password);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  type FieldType = {
    user?: string;
    password?: string;
  };
  console.log("The Cookie is: ", token)
  if (token) {
    console.log("I have a valid token: ", token);
    return (
      <div>
        <Row justify="center" align="middle">
          <Space>
            <Col>
              <h1>Angemeldet</h1>
              <h3>{user}</h3>
              <Row>
                <Button onClick={handleLogout}>Abmelden</Button>
                <Button onClick={back}>Back</Button>
              </Row>
            </Col>
          </Space>
        </Row>
      </div>
    );
  } else {
    return (
      <div>
        {error !== "" ? (
          <Alert
            message="Login failed."
            description={error}
            type="error"
            showIcon
            onClose={() => setError("")}
            closable
          />
        ) : (
          <div></div>
        )}

        <Title level={2}>Login</Title>
        <Form
          disabled={loading}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="User"
            name="user"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
