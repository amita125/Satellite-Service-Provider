import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Title } = Typography;

type NewGatewayModalPropTypes = {
  visible: boolean;
  close: () => void;
};

interface CompanyInfo {
  id: number;
  name: string;
  address: string;
  total_gateway: number;
}

const CreateGatewayModal = ({ visible, close }: NewGatewayModalPropTypes) => {
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);

  const authToken = localStorage.getItem("authToken");

  const fetchData = async () => {
    try {
      if (!authToken) {
        throw new Error("No authorization token found");
      }

      const response = await fetch("http://localhost:8000/api/company/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchData(); // Fetch data when the modal is shown
    }
  }, [visible]);

  const handleFormSubmit = async (values: any) => {
    values.company = +values.company;

    console.log(values)
    console.log(companies)

    try {
      const response = await fetch("http://localhost:8000/api/gateways/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        close();
      } else {
        throw new Error("Error creating gateway");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      destroyOnClose={true}
      title={<Title level={4}>Create a new gateway 😀</Title>}
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
          label="Gateway Name"
          name="gateway_name"
          rules={[
            { required: true, message: "Please enter the gateway name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Antenna Diameter"
          name="antenna_diameter"
          rules={[
            { required: true, message: "Please enter the antenna diameter!" },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Location Name"
          name="location_name"
          rules={[
            { required: true, message: "Please enter the location name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Latitude"
          name="latitude"
          rules={[{ required: true, message: "Please enter the latitude!" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Longitude"
          name="longitude"
          rules={[{ required: true, message: "Please enter the longitude!" }]}
        >
          <InputNumber />
        </Form.Item>

        {companies.length > 0 && (
          <Form.Item label="Company" name="company">
            <Select>
              {companies.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGatewayModal;
