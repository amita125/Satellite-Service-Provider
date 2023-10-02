/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Empty, Table, Space, Modal, Form, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

interface GatewayInfo {
  id: number;
  company: number;
  company_name: string;
  gateway_name: string;
  antenna_diameter: number;
  location_name: string;
  latitude: number;
  longitude: number;
}

const Gateways = () => {
  const [gateways, setGateways] = useState<GatewayInfo[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const role = localStorage.getItem("role");

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedGatewayInfo, setSelectedGatewayInfo] = useState<GatewayInfo>();
  const authToken = localStorage.getItem("authToken");

  const fetchGateways = async () => {
    setIsValidating(true);
    try {
      if (!authToken) {
        throw new Error("No authorization token found");
      }

      const response = await fetch("http://localhost:8000/api/gateways/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGateways(data);
        setIsValidating(false);
      } else {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleDelete = async (gatewayId: number) => {
    try {
      if (!authToken) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `http://localhost:8000/api/gateways/${gatewayId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "DELETE",
        }
      );

      if (response.ok) {
        setGateways((prevCompanies) =>
          prevCompanies.filter((gateways) => gateways.id !== gatewayId)
        );
      } else {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showEditModal = (gateway: GatewayInfo) => {
    setSelectedGatewayInfo(gateway);
    setIsEditModalVisible(true);
  };

  const handleEdit = async (values: any) => {
    console.log(values);

    try {
      const response = await fetch(
        `http://localhost:8000/api/gateways/${values.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        setIsEditModalVisible(false);
        setSelectedGatewayInfo(undefined);
        fetchGateways(); // Re-fetch data after successful edit
      } else {
        throw new Error("Error creating gateway");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsEditModalVisible(false);
  };

  const columns: ColumnsType<GatewayInfo> = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Gateway Name",
      dataIndex: "gateway_name",
      key: "gateway_name",
    },
    {
      title: "Antenna Diameter",
      dataIndex: "antenna_diameter",
      key: "antenna_diameter",
    },
    {
      title: "Location Name",
      dataIndex: "location_name",
      key: "location_name",
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    role === "administrator" && {
      // Render the "Action" column only if the user is an administrator
      title: "Action",
      key: "action",
      render: (_: any, record: GatewayInfo) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ].filter(Boolean) as ColumnsType<GatewayInfo>;
  return (
    <div>
      <h2>Gateways</h2>

      {gateways && gateways.length > 0 ? (
        <Table
          dataSource={gateways}
          loading={isValidating}
          rowKey={(record) => record.id.toString()}
          size="small"
          style={{ width: "100%" }}
          columns={columns}
        />
      ) : (
        <Empty />
      )}

      <Modal
        title="Edit Gateway Details"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedGatewayInfo(undefined);
        }}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
      >
        <Form initialValues={selectedGatewayInfo} onFinish={handleEdit}>
          <Form.Item label="Gateway Id" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item label="CompanyId" name="company">
            <Input disabled />
          </Form.Item>
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
            <Input />
          </Form.Item>
          <Form.Item
            label="location Name"
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
            <Input />
          </Form.Item>
          <Form.Item
            label="longitude"
            name="longitude"
            rules={[{ required: true, message: "Please enter the longitude!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Gateways;
