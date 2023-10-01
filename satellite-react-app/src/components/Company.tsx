import React, { useEffect, useState } from "react";
import { Button, Empty, Form, Input, Modal, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
interface CompanyInfo {
  id: number;
  name: string;
  address: string;
  total_gateway: number;
}

const Company = () => {
  const [companys, setCompanys] = useState<CompanyInfo[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const role = localStorage.getItem("role");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editCompanyInfo, setEditCompanyInfo] = useState<CompanyInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const authToken = localStorage.getItem("authToken");

  const showEditModal = (company: CompanyInfo) => {
    setEditCompanyInfo(company);
    setIsEditModalVisible(true);
  };

  const fetchCompanys = async () => {
    setIsValidating(true);

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("No authorization token found");
      }

      const response = await fetch("http://localhost:8000/api/company/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanys(data);
        setIsValidating(false);
      } else {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanys();
  }, []);

  const handleDelete = async (companyId: number) => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `http://localhost:8000/api/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCompanys((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== companyId)
        );
      } else {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  const handleEdit = async (values: any) => {
    console.log(values);

    try {
      const response = await fetch(
        `http://localhost:8000/api/company/${values.id}`,
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
        fetchCompanys(); // Re-fetch data after successful edit
      } else {
        throw new Error("Error creating company");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsEditModalVisible(false);
  };

  const columns: ColumnsType<CompanyInfo> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total Gateway",
      dataIndex: "total_gateway",
      key: "total_gateway",
    },
    role === "administrator" && {
      // Render the "Action" column only if the user is an administrator
      title: "Action",
      key: "action",
      render: (_: any, record: CompanyInfo) => (
        <Space size="middle">
          <button
            data-testid="edit-button"
            onClick={() => showEditModal(record)}
          >
            Edit
          </button>
          <button onClick={() => handleDelete(record.id)}>Delete</button>
        </Space>
      ),
    },
  ].filter(Boolean) as ColumnsType<CompanyInfo>;
  return (
    <div>
      <h2>Companys</h2>

      {companys && companys.length > 0 ? (
        <Table
          dataSource={companys}
          loading={isValidating}
          rowKey="id"
          size="small"
          style={{ width: "100%" }}
          columns={columns}
        />
      ) : (
        <Empty />
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Company"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form initialValues={editCompanyInfo} onFinish={handleEdit}>
        <Form.Item label="Company Id" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the company name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Please enter the company address!" },
            ]}
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

export default Company;
