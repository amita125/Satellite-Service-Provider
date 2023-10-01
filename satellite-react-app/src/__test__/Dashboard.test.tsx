import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../components/Dashboard";

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

// Assuming this is your onLogout function

describe("Dashboard", () => {
  test("renders Dashboard with Gateways menu", () => {
    render(<Dashboard />);
    const gatewaysMenu = screen.getAllByText("Gateways")[0];
    const gatewaysTitle = screen.getByText("Gateways", { selector: "h2" });

    expect(gatewaysMenu).toBeInTheDocument();
    expect(gatewaysTitle).toBeInTheDocument();
  });

  test("renders Dashboard with Admin menu for administrator role", () => {
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue("administrator");

    render(<Dashboard onLogout={() => {}} />);

    const menuItems = screen.getAllByRole("menuitem");

    expect(menuItems).toHaveLength(3);

    const gatewaysMenu = screen.getByRole("menuitem", { name: "Gateways" });
    const companyMenu = screen.getByRole("menuitem", { name: "Company" });
    const adminMenu = screen.getByRole("menuitem", { name: "Admin" });

    expect(gatewaysMenu).toBeInTheDocument();
    expect(companyMenu).toBeInTheDocument();
    expect(adminMenu).toBeInTheDocument();
  });

  test("calls onLogout when logout button is clicked", () => {
    const onLogout = jest.fn();
    render(<Dashboard onLogout={onLogout} />);

    const logoutButton = screen.getByLabelText("logout");
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalled();
  });
});
