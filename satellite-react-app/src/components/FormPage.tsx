import React, { useState } from "react";
import { Alert, Button, Form, Input, Space } from "antd";
import "../App.css";

interface FormPageProps {
  onLogin: () => void;
}

const FormPage = ({ onLogin }: FormPageProps) => {
  const [error, setError] = useState("");

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        onLogin();
      } else {
        setError(data.message);
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="form_page_container" data-testid="login-form">
      <div className="form_container">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Login</h1>
          <Form
            name="loginForm"
            size="large"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input data-testid="username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password data-testid="password" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" data-testid="Login">
                Submit
              </Button>
            </Form.Item>
          </Form>

          {error && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
              />
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
