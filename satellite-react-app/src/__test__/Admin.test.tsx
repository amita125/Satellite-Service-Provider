import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Import for the "toBeInTheDocument" matcher
import Admin from "../components/Admin";

describe("Admin Component", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };
  });
  test('renders "Admin" header', () => {
    render(<Admin />);
    const headerElement = screen.getByText("Admin");
    expect(headerElement).toBeInTheDocument();
  });

  test("opens User Provider modal on button click", () => {
    render(<Admin />);
    fireEvent.click(screen.getByText("Create User Provider"));
    const userProviderModal = screen.getByText(
      /Create a new satellite teleport service provider/
    );
    expect(userProviderModal).toBeInTheDocument();
  });

  test("opens Company modal on button click", () => {
    render(<Admin />);
    fireEvent.click(screen.getByText("Create Company"));
    const companyModal = screen.getByText("Create a new company 😀");
    expect(companyModal).toBeInTheDocument();
  });

  test("opens Gateway modal on button click", () => {
    render(<Admin />);
    fireEvent.click(screen.getByText("Create Gateway"));
    const gatewayModal = screen.getByText("Create a new gateway 😀");
    expect(gatewayModal).toBeInTheDocument();
  });
});
