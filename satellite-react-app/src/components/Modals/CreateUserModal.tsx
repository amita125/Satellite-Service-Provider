import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;

type NewUserModalPropTypes = {
  visible: boolean;
  close: () => void;
};

function CreateUserModal({ visible, close }: NewUserModalPropTypes) {
  const authToken = localStorage.getItem("authToken");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const { confirm, ...submitValues } = values; // Omit 'confirm' from the values
    try {
      if (!authToken) {
        throw new Error("Authorization token found");
      }

      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(submitValues),
      });
      const data = await response.json();

      if (response.ok) {
        close();
      } else {
        setError(true);
        setErrorMessage(data.message);
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setError(false);
    setErrorMessage("");
  }, [visible]);

  return (
    <Modal
      destroyOnClose={true}
      title={
        <Title level={4}>
          Create a new satellite teleport service provider 😀
        </Title>
      }
      onCancel={close}
      open={visible}
      bodyStyle={{ height: "400px" }}
      centered
      width={600}
      footer={null}
    >
      {error && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 700 }}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="User Role"
          name="role"
          rules={[{ required: true, message: "Select something!" }]}
          initialValue="operator"
        >
          <Select>
            <Select.Option value="administrator">Administrator</Select.Option>
            <Select.Option value="operator">Operator</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateUserModal;
