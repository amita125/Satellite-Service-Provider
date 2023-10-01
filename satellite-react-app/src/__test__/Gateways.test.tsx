import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Gateways from "../components/Gateways";

jest.mock("node-fetch");
let localStorageMock: { [key: string]: string } = {};

beforeEach(() => {
  // Set the authorization token
  localStorageMock = {
    authToken: "yourAuthTokenHere",
  };

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => localStorageMock[key],
      setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
    },
  });
});

describe("Gateways Component", () => {
  test('renders "Gateways" header', () => {
    render(<Gateways />);

    const headerElement = screen.getByText("Gateways");
    expect(headerElement).toBeInTheDocument();
  });

  test("displays empty state when no data is available", async () => {
    render(<Gateways />);
    // Assume no data is available
    await waitFor(() => {
      const emptyElement = screen.getByText(/no data/i);
      expect(emptyElement).toBeInTheDocument();
    });
  });
});
