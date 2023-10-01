import { Button, Form, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
const { Title } = Typography;

type NewCompanyModalPropTypes = {
  visible: boolean;
  close: () => void;
};

function CreateCompanyModal({ visible, close }: NewCompanyModalPropTypes) {
  const authToken = localStorage.getItem("authToken");

  const handleFormSubmit = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/company/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        close();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      destroyOnClose={true}
      title={<Title level={4}>Create a new company 😀</Title>}
      onCancel={close}
      open={visible}
      bodyStyle={{ height: "400px" }}
      centered
      width={600}
      footer={null}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 700 }}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          label="Company Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the company name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Company Address"
          name="address"
          rules={[
            { required: true, message: "Please enter the company address!" },
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

export default CreateCompanyModal;
