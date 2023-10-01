import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormPage from "../components/FormPage";

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



test("renders login form", () => {
  render(<FormPage onLogin={() => {}} />);

  const usernameInput = screen.getByLabelText("Username");
  const passwordInput = screen.getByLabelText("Password");
  const submitButton = screen.getByText("Submit");

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("displays error message on failed login", async () => {
  render(<FormPage onLogin={() => {}} />);

  // Mock a failed login request
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ message: "Invalid credentials" }),
  });

  const usernameInput = screen.getByLabelText("Username");
  const passwordInput = screen.getByLabelText("Password");
  const submitButton = screen.getByText("Submit");

  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "testpassword" } });

  fireEvent.click(submitButton);

  // Wait for the error message to appear
  const errorMessage = await screen.findByText("Invalid credentials");
  expect(errorMessage).toBeInTheDocument();
});
