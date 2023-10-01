import { Button } from "antd";
import React, { useState } from "react";
import CreateGatewayModal from "./Modals/CreateGatewayModal";
import CreateCompanyModal from "./Modals/CreateCompanyModal";
import CreateUserModal from "./Modals/CreateUserModal";

function Admin() {
  const [gatewayModal, setGatewayModal] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);
  const [userProviderModal, setUserProviderModal] = useState(false);

  return (
    <div>
      <h2>Admin</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
          margin: "20px",
        }}
      >
        <Button type="primary" onClick={() => setUserProviderModal(true)}>
          Create User Provider
        </Button>
        <Button type="primary" onClick={() => setCompanyModal(true)}>
          Create Company
        </Button>
        <Button type="primary" onClick={() => setGatewayModal(true)}>
          Create Gateway
        </Button>
      </div>
      <CreateGatewayModal
        visible={gatewayModal}
        close={() => setGatewayModal(false)}
      />
      <CreateCompanyModal
        visible={companyModal}
        close={() => setCompanyModal(false)}
      />
      <CreateUserModal
        visible={userProviderModal}
        close={() => setUserProviderModal(false)}
      />

    </div>
  );
}

export default Admin;
