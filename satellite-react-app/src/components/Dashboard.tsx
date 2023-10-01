import React, { useState } from "react";
import { Button, Layout, Menu, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Gateways from "./Gateways";
import Company from "./Company";
import Admin from "./Admin";

import '../App.css';

const { Header, Footer, Sider, Content } = Layout;
const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#1b3f38",
  display: "flex",
  justifyContent: "space-between",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#000",
  backgroundColor: "#fff",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#4a6f66",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#1b3f38",
};

function Dashboard({ onLogout }: any) {
  const role = localStorage.getItem("role");

  const handleLogoutClick = () => {
    onLogout();
  };

  const [current, setCurrent] = useState("1");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const menuItems = [
    {
      key: "1",
      label: "Gateways",
    },
    {
      key: "2",
      label: "Company",
    },
  ];
  
  if (role === 'administrator') {
    menuItems.push({
      key: "3",
      label: "Admin",
    });
  }
  

  return (
    <div className="dashboard_container"  data-testid="dashboard">
      <Layout>
        <Header style={headerStyle}>
          Satellite Teleport Service Provider
          <div style={{ paddingTop: "5px" }}>
            <Tooltip title="logout">
              <Button
                type="default"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={handleLogoutClick}
              />
            </Tooltip>
          </div>
        </Header>
        <Layout hasSider>
          <Sider style={siderStyle}>
            <Menu
              mode="inline"
              onClick={onClick}
              selectedKeys={[current]}
              style={{
                backgroundColor: "#4a6f66",
                borderRight: 0,
                color: "#fff",
              }}
              items={menuItems}
            />
          </Sider>
          <Content style={contentStyle}>
            {current === "1" ? (
              <Gateways />
            ) : current === "2" ? (
              <Company/>
            ) : (
              <Admin/>
            )}
          </Content>
        </Layout>
        <Footer style={footerStyle}>
          {" "}
          Satellite Teleport Service Provider App © {new Date().getFullYear()}{" "}
          Created by AmitaGhale
        </Footer>
      </Layout>
    </div>
  );
}

export default Dashboard;
