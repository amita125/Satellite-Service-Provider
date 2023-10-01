import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "../App";

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

describe("App Component", () => {
  test("renders FormPage when not logged in", () => {
    render(<App />);
    const formPageElement = screen.getByTestId("login-form");
    expect(formPageElement).toBeInTheDocument();
  });
});
