import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateGatewayModal from "../components/Modals/CreateGatewayModal";

describe("CreateGatewayModal", () => {
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

  test("renders modal with form elements", () => {
    const visible = true;
    const close = jest.fn();

    render(<CreateGatewayModal visible={visible} close={close} />);

    // Check if the modal title is rendered
    const modalTitle = screen.getByText("Create a new gateway 😀");
    expect(modalTitle).toBeInTheDocument();

    // Check if form inputs are rendered
    const gatewayNameInput = screen.getByLabelText("Gateway Name");
    expect(gatewayNameInput).toBeInTheDocument();

    const antennaDiameterInput = screen.getByLabelText("Antenna Diameter");
    expect(antennaDiameterInput).toBeInTheDocument();

    const locationNameInput = screen.getByLabelText("Location Name");
    expect(locationNameInput).toBeInTheDocument();

    const latitudeInput = screen.getByLabelText("Latitude");
    expect(latitudeInput).toBeInTheDocument();

    const longitudeInput = screen.getByLabelText("Longitude");
    expect(longitudeInput).toBeInTheDocument();

    // Check if the submit button is rendered
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
  });

  test("calls close function when modal is closed", () => {
    const visible = true;
    const close = jest.fn();

    render(<CreateGatewayModal visible={visible} close={close} />);

    // Close the modal
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    // Check if close function is called
    expect(close).toHaveBeenCalledTimes(1);
  });

  // Add more tests as needed...
});
