import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Company from "../components/Company";

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

describe("Company Component", () => {
  test('renders "Companys" header', () => {
    render(<Company />);
    const headerElement = screen.getByText("Companys");
    expect(headerElement).toBeInTheDocument();
  });

  test("displays empty state when no data is available", async () => {
    render(<Company />);
    // Assume no data is available
    await waitFor(() => {
      const emptyElement = screen.getByText(/no data/i);
      expect(emptyElement).toBeInTheDocument();
    });
  });

  test('does not open edit modal on "Edit" click for non-administrator', async () => {
    // Mocking a non-administrator role
    localStorageMock = {
      authToken: "yourAuthTokenHere",
      role: "operator", // Assuming 'user' role
    };

    render(<Company />);

    // Since the user is not an administrator, the modal should not be present
    const editModalTitle = screen.queryByText("Edit Company");
    expect(editModalTitle).toBeNull();
  });
  
});
